### Web scrape the url from newsfetcher
from newspaper import Article
from newsapi import NewsApiClient
import nltk
import dotenv

dotenv.load_dotenv()

nltk.download('punkt_tab')


# newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))

# news = newsapi.get_top_headlines(language='en', country='us')

def get_news(url):
    article = Article(url)
    article.download()
    article.parse()
    article.nlp()  # This generates summary and keywords
    
    return {
        'summary': article.summary,
        'keywords': article.keywords,
        'title': article.title,
        'text': article.text
    }

# article = news['articles'][0]

# stringA = article['url']
# stringB = "https://apnews.com/article/biden-citizens-medals-jan-6-cheney-thompson-f725b7003ea11239b90962a8cf0d5305"
# res = get_news(stringB)

# print(res["text"])
