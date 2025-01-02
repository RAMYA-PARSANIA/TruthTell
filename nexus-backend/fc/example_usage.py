from fact_checker import FactChecker
import json
import os
import dotenv

dotenv.load_dotenv()

def main():
    # Initialize with both API keys
    fact_checker = FactChecker(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        serper_api_key=os.getenv("SERPER_API_KEY")
    )
    
    news_text = """
    A new study shows that drinking coffee reduces the risk of heart disease by 50%. 
    The research was conducted over 10 years with 100,000 participants across Europe.
    """
    
    report = fact_checker.generate_report(news_text)
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
