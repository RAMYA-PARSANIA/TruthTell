from kafka import KafkaConsumer, KafkaProducer
import json
from factcheck import FactCheck
from fc.fact_checker import FactChecker
import os
import dotenv

dotenv.load_dotenv()

class KafkaHandler:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9091'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        )
        self.consumer = KafkaConsumer(
            'news_input',
            bootstrap_servers=['localhost:9091'],
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            auto_offset_reset='earliest',  # This will read from the beginning
            enable_auto_commit=True,
            group_id=None  # This ensures no offset tracking
        )

        self.factchecker = FactChecker(groq_api_key=os.getenv("GROQ_API_KEY"), serper_api_key=os.getenv("SERPER_API_KEY"))

    async def process_news(self):
        print("Starting consumer...")
        try:
            print("Trying...")
            for message in self.consumer:
                print("###############################################")
                print(f"Received message: {message}")
                print("###############################################")
                news_text = message['text']
                if not news_text or '[Removed]' in news_text:
                    continue
                print(f"Processing news text: {news_text}")
                print("###############################################")
                result = self.factchecker.check_text(news_text)
                print(f"Result: {result}")
                print("###############################################")
                
                # Send and flush the message
                self.producer.send('factcheck_results', result)
                self.producer.flush()  # Ensure the message is sent
                
        except Exception as e:
            print("###############################################")
            print(f"Error processing message: {str(e)}")
            print("###############################################")
        finally:
            # Clean shutdown
            self.producer.close()


