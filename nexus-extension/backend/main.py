from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from datetime import datetime
import uvicorn

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def create_fact_check_model():
    """Create and configure the Gemini model for fact checking"""
    generation_config = {
        "temperature": 0.2,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_schema": content.Schema(
            type=content.Type.OBJECT,
            required=["summary", "claims"],
            properties={
                "summary": content.Schema(
                    type=content.Type.STRING,
                ),
                "claims": content.Schema(
                    type=content.Type.ARRAY,
                    items=content.Schema(
                        type=content.Type.OBJECT,
                        required=["statement", "accuracy", "explanation"],
                        properties={
                            "statement": content.Schema(
                                type=content.Type.STRING,
                            ),
                            "accuracy": content.Schema(
                                type=content.Type.STRING,
                            ),
                            "explanation": content.Schema(
                                type=content.Type.STRING,
                            ),
                        },
                    ),
                ),
            },
        ),
        "response_mime_type": "application/json",
    }

    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
    )

# Define request model
class PageData(BaseModel):
    title: str = ""
    content: str = ""
    url: str = ""
    
class TranscriptData(BaseModel):
    transcript: str
    title: str = "Speech Transcript"
    source: str = "Broadcast"

@app.post('/api/fact-check')
async def fact_check(page_data: PageData):
    try:
        # Extract title, content, and URL from page data
        title = page_data.title
        content = page_data.content
        url = page_data.url
        
        # Truncate content if too long
        content_to_analyze = content[:8000] + ('... (content truncated)' if len(content) > 8000 else '')
        
        print(content_to_analyze)
        # Create the model and chat session
        model = create_fact_check_model()
        chat = model.start_chat(history=[])
        
        # Prepare prompt for Gemini API
        prompt = f"""
        Please fact check the following content from the web page titled "{title}" (URL: {url}).
        
        CONTENT:
        {content_to_analyze}
        
        Please provide a fact-checking analysis with the following structure:
        1. A brief summary of the overall factual accuracy (1-2 sentences)
        2. Identify 3-5 specific claims made in the content
        3. For each claim, provide:
           - The claim statement
           - An accuracy assessment (accurate, inaccurate, partially accurate, or unverifiable)
           - A brief explanation with evidence
        """
        
        # Send message to Gemini
        response = chat.send_message(prompt)
        
        # Parse the response
        analysis_result = json.loads(response.text)
        
        # Add timestamp and metadata
        result = {
            "timestamp": datetime.now().isoformat(),
            "url": url,
            "title": title,
            "analysis": analysis_result
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/fact-check-transcript')
async def fact_check_transcript(transcript_data: TranscriptData):
    try:
        # Extract transcript and metadata
        transcript = transcript_data.transcript
        title = transcript_data.title
        source = transcript_data.source
        
        # Truncate transcript if too long
        transcript_to_analyze = transcript[:8000] + ('... (content truncated)' if len(transcript) > 8000 else '')
        
        print(transcript_to_analyze)
        # Create the model and chat session
        model = create_fact_check_model()
        chat = model.start_chat(history=[])
        
        # Prepare prompt for Gemini API
        prompt = f"""
        Please fact check the following speech transcript titled "{title}" (Source: {source}).
        
        TRANSCRIPT:
        {transcript_to_analyze}
        
        Please provide a fact-checking analysis with the following structure:
        1. A brief summary of the overall factual accuracy (1-2 sentences)
        2. Identify 3-5 specific claims made in the speech
        3. For each claim, provide:
           - The claim statement
           - An accuracy assessment (accurate, inaccurate, partially accurate, or unverifiable)
           - A brief explanation with evidence
        """
        
        # Send message to Gemini
        response = chat.send_message(prompt)
        
        # Parse the response
        analysis_result = json.loads(response.text)
        
        # Add timestamp and metadata
        result = {
            "timestamp": datetime.now().isoformat(),
            "source": source,
            "title": title,
            "analysis": analysis_result
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/health')
async def health_check():
    return {"status": "healthy", "service": "fact-checker-api"}

if __name__ == '__main__':
    uvicorn.run("app:app", host='127.0.0.1', port=7777, reload=True)
