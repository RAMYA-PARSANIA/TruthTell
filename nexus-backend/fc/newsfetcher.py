from newsapi import NewsApiClient
import asyncio
import os
from dotenv import load_dotenv
from news_summ import get_news
from pipline import GlassFlowSource
from fact_checker import FactChecker
import expAi

load_dotenv()

class NewsFetcher:
    def __init__(self):
        self.newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))
        self.fetched_pages = []
        self.glassflow = GlassFlowSource(access_token=os.getenv('GLASSFLOW_ACCESS_TOKEN'))
        self.fact_checker = FactChecker(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            serper_api_key=os.getenv("SERPER_API_KEY")
        )
        
    async def fetch_and_produce(self):
        try:
            news = self.newsapi.get_top_headlines(language='en', page_size=1)
                                                    
            if not news['articles']:
                return {
                    "status": "error",
                    "content": None
                }
                
            article = news['articles'][0]
            url = article['url']
            
            if url in self.fetched_pages:
                return {
                    "status": "error",
                    "content": None
                }
            
            self.fetched_pages.append(url)

            # Get full text
            news_text = get_news(url)
            if news_text['status'] == 'error':
                return {
                    "status": "error",
                    "content": None
                }
            
                
            # Run fact check - it will be run through transformation pipeline
            fact_check_result = self.fact_checker.generate_report(news_text['text'])
            
            explanation = expAi.explain_factcheck_result(fact_check_result)

            # Get visualization data
            viz_data = expAi.generate_visual_explanation(explanation["explanation"])
            

            
            
            # Publish to glassflow
            self.glassflow.data_source.publish(fact_check_result)

            return {
                "status": "success",
                'article': news_text,
                'fact_check': fact_check_result
            }


        except Exception as e:
            print(f"Error fetching news: {e}")