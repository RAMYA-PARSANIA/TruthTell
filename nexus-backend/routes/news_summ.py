### Web scrape the url from newsfetcher
from newspaper import Article
import nltk

nltk.download('punkt_tab')

def get_news(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        article.nlp()  # This generates summary and keywords
        
        return {
            'status': 'success',
            'summary': article.summary,
            'keywords': article.keywords,
            'title': article.title,
            'text': article.text,
            'url': url
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

##########---------------###############
# Example usage:

# from newsapi import NewsApiClient
# import dotenv

# dotenv.load_dotenv()

# newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))

# news = newsapi.get_top_headlines(language='en', country='us')
# article = news['articles'][0]

# stringA = article['url']
# stringB = "https://apnews.com/article/biden-citizens-medals-jan-6-cheney-thompson-f725b7003ea11239b90962a8cf0d5305"
# res = get_news(stringB)

# #print(res["text"])
