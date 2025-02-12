from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from decouple import config
from bson import ObjectId
import os
import dotenv
from .news_summ import get_news

dotenv.load_dotenv()

link_router = APIRouter()

@link_router.post("/news-link")
async def handle_news(link: str):
    print("Hello")
    

@link_router.post("/insta-link")
async def handle_insta(link: str):
    print("Hello")
    
    
@link_router.post("/x-link")
async def handle_x(link: str):
    print("Hello")
    
    
@link_router.post("/text-route")
async def handle_text(link: str):
    print("Hello")
