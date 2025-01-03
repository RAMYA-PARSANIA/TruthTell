from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from db.init_db import Database
from routes.auth import router as auth_router
from contextlib import asynccontextmanager
from util.kafka_handler import KafkaHandler
from util.newsfetcher import NewsFetcher
import asyncio
from kafka import KafkaConsumer
import json
import nest_asyncio
nest_asyncio.apply()
from pydantic import BaseModel
from Gemini.final import get_gemini_analysis
import os
from tempfile import NamedTemporaryFile


kafka_handler = None
news_fetcher = None
background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start up
    await Database.connect_db()
    global kafka_handler, news_fetcher, background_tasks
    
    kafka_handler = KafkaHandler()
    news_fetcher = NewsFetcher()
    
    # Start background tasks
    t1 = asyncio.create_task(news_fetcher.fetch_and_produce())
    
    t2 = asyncio.create_task(kafka_handler.process_news())

    background_tasks.update([t1, t2])
    
    yield
    # Shut down
    for task in background_tasks:
        task.cancel()
    await asyncio.gather(*background_tasks, return_exceptions=True)
    await Database.close_db()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["authentication"])

@app.websocket("/ws/factcheck-stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    consumer = KafkaConsumer(
        'factcheck_results',
        bootstrap_servers=['localhost:9092'],
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    try:
        for message in consumer:
            await websocket.send_json(message.value)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

class NewsInput(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_news(news: NewsInput):
    try:
        gemini_analysis = get_gemini_analysis(news.text)
        return {
            "detailed_analysis": gemini_analysis
        }
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.post("/detect-deepfake")
async def detect_deepfake(image: UploadFile = File(...)):
    try:
        # Save uploaded image temporarily
        with NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            contents = await image.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name

        # Use your existing deepfake detection function
        from deepfake2.testing2 import test_image  # Use your existing function
        result = test_image(temp_file_path)
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        return result
        
    except Exception as e:
        return {"error": str(e)}, 500