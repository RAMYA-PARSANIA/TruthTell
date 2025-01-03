import requests
from bs4 import BeautifulSoup
from groq import Groq
import os
from dotenv import load_dotenv

def scrape_webpage(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Remove script and style elements
    for script in soup(['script', 'style']):
        script.decompose()
    
    # Get text content
    text = ' '.join(soup.stripped_strings)
    return text[:4500]

def summarize_with_groq(text):
    load_dotenv()
    
    client = Groq(
        api_key=os.getenv('GROQ_API_KEY')
    )
    
    prompt = f"""Please provide a concise summary of the following text, focusing on the key facts that could be used for fact-checking:

    {text}

    Format the response as:
    - Main claim:
    - Key facts:
    - Sources mentioned:
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="mixtral-8x7b-32768",
        temperature=0.1,
    )
    
    return chat_completion.choices[0].message.content

def main(url):
    try:
        # Scrape the webpage
        content = scrape_webpage(url)
        
        # Get summary from Groq
        summary = summarize_with_groq(content)
        
        return summary
        
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    url = input("Enter the webpage URL to analyze: ")
    result = main(url)
    print("\nSummary and Fact-Check Information:")
    print(result)
