from newsapi import NewsApiClient
from kafka import KafkaProducer
import json
import asyncio
import os
from dotenv import load_dotenv
from .news_summ import get_news

load_dotenv()

class NewsFetcher:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.fetched_pages = []
        
    async def fetch_and_produce(self):
        while True:
            try:
                # Run blocking newsapi call in thread
                news = await asyncio.to_thread(
                    self.newsapi.get_top_headlines,
                    language='en',
                    country='us'
                )
                
                for article in news['articles']:
                    url = article['url']
                    if url in self.fetched_pages:
                        continue

                    self.fetched_pages.append(url)
                    
                    news_text = get_news(url)
                    if news_text['status'] == 'error':
                        continue
                    
                    # Run blocking Kafka operations in thread
                    await asyncio.to_thread(
                        self.producer.send,
                        'news_input',
                        {'text': news_text}
                    )
                    await asyncio.to_thread(self.producer.flush)
                    
                await asyncio.sleep(300)
                
            except Exception as e:
                print(f"Error fetching news: {e}")
                await asyncio.sleep(60)

#########----------###########
# Example usage:
# n = NewsFetcher()

# asyncio.run(n.fetch_and_produce())
