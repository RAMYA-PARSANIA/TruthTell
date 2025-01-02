from newsapi import NewsApiClient
from kafka import KafkaProducer
import json
import asyncio
import os
from dotenv import load_dotenv
from .get_news import get_news

load_dotenv()

class NewsFetcher:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9091'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
    async def fetch_and_produce(self):
        while True:
            try:
                news = self.newsapi.get_top_headlines(language='en', country='us')
                for article in news['articles']:
                    print("###############################################")
                    # if not article['description'] or '[Removed]' in article['description']:
                    #     print("Skipping article due to missing text or '[Removed]' in text")
                    #     continue
                    news_text = get_news(article['url'])
                    print(f"Sending news: {news_text}")
                    print("###############################################")
                    self.producer.send('news_input', {
                        'text': news_text
                    })
                await asyncio.sleep(300)  # Fetch every 5 minutes
            except Exception as e:
                print(f"Error fetching news: {e}")
                await asyncio.sleep(60)
