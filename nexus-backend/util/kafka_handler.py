from kafka import KafkaConsumer, KafkaProducer
import json
from factcheck import FactCheck

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
            auto_offset_reset='earliest',  # This will read from the beginning
            enable_auto_commit=True,
            group_id=None  # This ensures no offset tracking
        )

        self.factchecker = FactCheck()

    async def process_news(self):
        print("Starting Kafka consumer...")
        print("Waiting for messages on 'news_input' topic...")
        try:
            for message in self.consumer:
                print(f"Received message: {message}")
                news_text = message.value['text']
                if not news_text or '[Removed]' in news_text:
                    continue
                print(f"Processing news text: {news_text}")
                result = self.factchecker.check_text(news_text)
                print(f"Result: {result}")
                
                # Send and flush the message
                future = self.producer.send('factcheck_results', result)
                self.producer.flush()  # Ensure the message is sent
                
                # Get the metadata about the sent message
                metadata = future.get(timeout=10)
                print(f"Message sent to topic {metadata.topic}, partition {metadata.partition}, offset {metadata.offset}")
                
        except Exception as e:
            print(f"Error processing message: {str(e)}")
        finally:
            # Clean shutdown
            self.producer.close()


