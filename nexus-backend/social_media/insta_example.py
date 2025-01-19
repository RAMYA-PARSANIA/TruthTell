import requests
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("INSTA_SCRAP_URL")

querystring = {"username_or_id_or_url":"mrbeast"}

headers = {
	"x-rapidapi-key": os.getenv("X_RAPIDAPI_KEY"),
	"x-rapidapi-host": os.getenv("X_RAPIDAPI_HOST") 
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())