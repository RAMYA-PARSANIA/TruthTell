from kafka import KafkaConsumer, KafkaProducer
import json
from factcheck import FactCheck

class KafkaHandler:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.consumer = KafkaConsumer(
            'news_input',
            bootstrap_servers=['localhost:9092'],
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        self.factchecker = FactCheck()

    async def process_news(self):
        for message in self.consumer:
            news_text = message.value['text']
            result = self.factchecker.check_text(news_text)
            self.producer.send('factcheck_results', result)
