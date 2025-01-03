from kafka import KafkaConsumer, KafkaProducer
import json
from fc.fact_checker import FactChecker
import os
import dotenv
import asyncio

dotenv.load_dotenv()

class KafkaHandler:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        )
        self.consumer = KafkaConsumer(
            'news_input',
            bootstrap_servers=['localhost:9092'],
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            auto_offset_reset='latest',
            enable_auto_commit=True,
            group_id=None  # This ensures no offset tracking
        )

        self.factchecker = FactChecker(groq_api_key=os.getenv("GROQ_API_KEY"), serper_api_key=os.getenv("SERPER_API_KEY"))

    async def process_news(self):
        try:
            while True:  # Add loop to keep consumer running
                try:
                    message = await asyncio.to_thread(next, self.consumer)
                    
                    news_text = message.value['text']
                    if not news_text or '[Removed]' in news_text:
                        continue
                    
                    result = self.factchecker.generate_report(news_text['summary'])
                                        
                    # Send using asyncio
                    await asyncio.to_thread(
                        self.producer.send, 
                        'factcheck_results', 
                        {'result':result,
                         'url': news_text['url'],
                         'title': news_text['title'],
                         'summary': news_text['summary']
                         }
                    )

                    await asyncio.to_thread(self.producer.flush)
                    await asyncio.sleep(60)
                    
                except Exception as e:
                    print(f"Error processing message: {str(e)}")
                    await asyncio.sleep(1)
                    
        except Exception as e:
            print(f"Consumer error: {str(e)}")
        finally:
            self.producer.close()


