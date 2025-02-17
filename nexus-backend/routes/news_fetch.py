from .news_summ import get_news
from fastapi import Depends, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from .auth import get_current_user
import os
from dotenv import load_dotenv
from fc.newsfetcher import NewsFetcher
import json
import asyncio


load_dotenv()

news_router = APIRouter()

@news_router.websocket("/ws/news")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            news_fetcher = NewsFetcher()
            news_data = await news_fetcher.fetch_and_produce()

            # print(news_data)
            
            if news_data["status"] == "success":
                await websocket.send_json(news_data)
            
            # Wait for 5 minutes before fetching new data
            await asyncio.sleep(300)
            
        except WebSocketDisconnect:
            break
        except Exception as e:
            error_message = {"status": "error", "message": str(e)}
            await websocket.send_json(error_message)

@news_router.get("/get_news")
async def get_news_route(current_user: dict = Depends(get_current_user)):
    try:
        news_fetcher = NewsFetcher()
        news_data = await news_fetcher.fetch_and_produce()
        return {"status": "success", "data": news_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))