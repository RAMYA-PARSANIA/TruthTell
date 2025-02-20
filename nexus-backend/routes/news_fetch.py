from .news_summ import get_news
from fastapi import Depends, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from .auth import get_current_user
import os
from dotenv import load_dotenv
from fc.newsfetcher import NewsFetcher
import json
import asyncio
from fc.expAi import explain_factcheck_result, generate_visual_explanation
from fc.fact_checker import FactChecker

from pydantic import BaseModel

class UrlInput(BaseModel):
    url: str

class TextInput(BaseModel):
    text: str

load_dotenv()

news_router = APIRouter()

@news_router.websocket("/ws/news")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            news_fetcher = NewsFetcher()
            news_data = await news_fetcher.fetch_and_produce()

            
            if news_data["status"] == "success":
                print(news_data)
                await websocket.send_json(news_data)
            
            # Wait for 1 minutes before fetching new data
            await asyncio.sleep(60)
            
        except WebSocketDisconnect:
            break
        except Exception as e:
            error_message = {"status": "error", "message": str(e)}
            await websocket.send_json(error_message)

@news_router.post("/get-fc-url")
async def get_fc_url(input_data: UrlInput):
    try:
        news_text = get_news(input_data.url)
        
        if news_text['status'] == 'error':
            return {
                "status": "error",
                "content": None
            }
        
        fact_checker = FactChecker(groq_api_key=os.getenv("GROQ_API_KEY"), serper_api_key=os.getenv("SERPER_API_KEY"))
        # Run fact check - it will be run through transformation pipeline
        fact_check_result = fact_checker.generate_report(news_text['text'])
        
        
        explanation = explain_factcheck_result(fact_check_result)

        # Get visualization data
        viz_data = generate_visual_explanation(explanation["explanation"])
        
        #return an object with fact check result and visualization data, and explanation
        return {
            "status": "success",
            "content": {
                "news_text": news_text,
                "fact_check_result": fact_check_result,
                "explanation": explanation,
                "viz_data": viz_data
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@news_router.post("/get-fc-text")
async def get_fc_text(input_data: TextInput):
    try:
        fact_checker = FactChecker(groq_api_key=os.getenv("GROQ_API_KEY"), serper_api_key=os.getenv("SERPER_API_KEY"))
        # Run fact check - it will be run through transformation pipeline
        fact_check_result = fact_checker.generate_report(input_data.text)
        
        
        explanation = explain_factcheck_result(fact_check_result)

        # Get visualization data
        viz_data = generate_visual_explanation(explanation["explanation"])
        
        #return an object with fact check result and visualization data, and explanation
        return {
            "status": "success",
            "content": {
                "news_text": input_data.text,
                "fact_check_result": fact_check_result,
                "explanation": explanation,
                "viz_data": viz_data
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))