from newsapi import NewsApiClient
from kafka import KafkaProducer
import json
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

class NewsFetcher:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
    async def fetch_and_produce(self):
        print("Starting NewsFetcher...")
        while True:
            try:
                news = self.newsapi.get_top_headlines(language='en', country='us')
                # self.producer.send('news_input', {
                #     'title': "Trial",
                #     'text': "Trial text",
                #     'url': "https://www.google.com"
                # })
                for article in news['articles']:
                    print(f"Sending news: {article['description']}")
                    if article['description']:
                        self.producer.send('news_input', {
                            'title': article['title'],
                            'text': article['description'],
                            'url': article['url']
                        })
                await asyncio.sleep(300)  # Fetch every 5 minutes
            except Exception as e:
                print(f"Error fetching news: {e}")
                await asyncio.sleep(60)
