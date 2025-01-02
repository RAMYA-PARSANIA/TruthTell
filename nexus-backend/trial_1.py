from factcheck import FactCheck
from util.get_news import get_news

fc = FactCheck()

# url = "https://sports.ndtv.com/australia-vs-india-2024-25/rohit-sharma-likely-to-be-rested-for-5th-test-against-australia-jasprit-bumrah-to-lead-7383806#pfrom=home-ndtv_topscroll"
# news = get_news(url)
# print(f"News: {news}")

res = fc.check_text("Noida Schools To Remain Closed Up Till Class 8 Starting Today Due To Cold Wave")
print(f"Result: {res}")