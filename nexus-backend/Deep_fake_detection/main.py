from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import numpy as np
import cv2
import torch
from pydantic import BaseModel
from datetime import datetime
import logging
from pathlib import Path
from detector import DeepFakeDetector
from videoprocess import VideoProcessor
from result import ResultAggregator
from error_handlers import handle_detection_error

logging.baseConfig(
    level = logging.INFO,
    format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Deep Fake Detection API",
    description="API for detecting deep fake images and videos",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for getting detector instances
async def get_detector():
    detector = DeepFakeDetector()
    try:
        yield detector
    finally:
        # Cleanup if needed
        pass

# Data Models
class DetectionResult(BaseModel):
    is_deepfake: bool
    confidence_score: float
    detection_method: str
    analyzed_features: List[str]
    processing_time: float
    timestamp: datetime

class AnalysisMetadata(BaseModel):
    file_hash: str
    file_size: int
    frame_count: Optional[int]
    resolution: tuple
    format: str

# Routes with integrated components
@app.post("/api/v1/analyze/image", response_model=DetectionResult)
async def analyze_image(
    file: UploadFile = File(...),
    detector: DeepFakeDetector = Depends(get_detector)
):
    """
    Analyze a single image for deep fake detection
    """
    try:
        logger.info(f"Processing image: {file.filename}")
        
        # Read and preprocess image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Get image metadata
        metadata = AnalysisMetadata(
            file_hash=compute_file_hash(contents),
            file_size=len(contents),
            resolution=(image.shape[1], image.shape[0]),
            format=file.content_type
        )
        
        # Run detection using our detector class
        result = detector.detect(image)
        
        logger.info(f"Analysis complete for {file.filename}")
        
        return DetectionResult(
            is_deepfake=result['is_deepfake'],
            confidence_score=result['confidence'],
            detection_method="ensemble_cnn",
            analyzed_features=["facial_features", "image_artifacts", "noise_patterns"],
            processing_time=result['processing_time'],
            timestamp=datetime.now()
        )
    
    except Exception as e:
        logger.error(f"Error processing image {file.filename}: {str(e)}")
        raise handle_detection_error(e)

@app.post("/api/v1/analyze/video", response_model=DetectionResult)
async def analyze_video(
    file: UploadFile = File(...),
    detector: DeepFakeDetector = Depends(get_detector)
):
    """
    Analyze a video for deep fake detection
    """
    try:
        logger.info(f"Processing video: {file.filename}")
        
        # Initialize video processor and result aggregator
        processor = VideoProcessor(detector)
        aggregator = ResultAggregator()
        
        # Save video temporarily
        contents = await file.read()
        temp_path = save_temp_file(contents)
        
        try:
            # Process video frames
            frame_results = await processor.process_video(temp_path)
            
            # Aggregate results
            final_result = aggregator.aggregate_video_results(frame_results)
            
            logger.info(f"Video analysis complete for {file.filename}")
            
            return DetectionResult(
                is_deepfake=final_result['is_deepfake'],
                confidence_score=final_result['confidence'],
                detection_method="temporal_cnn",
                analyzed_features=["facial_dynamics", "temporal_consistency", "audio_visual_sync"],
                processing_time=final_result['processing_time'],
                timestamp=datetime.now()
            )
            
        finally:
            # Cleanup temporary file
            Path(temp_path).unlink(missing_ok=True)
    
    except Exception as e:
        logger.error(f"Error processing video {file.filename}: {str(e)}")
        raise handle_detection_error(e)

# Middleware for request logging
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Create required directories
def create_directories():
    """Create necessary directories for the application"""
    directories = ['temp', 'logs']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize everything we need on startup"""
    create_directories()
    logger.info("Application started")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Application shutting down")
    # Add any cleanup code here

# File structure should look like:
"""
deepfake_detector/
│
├── main.py              # This file
├── detector.py          # DeepFakeDetector class from previous code
├── video_processor.py   # VideoProcessor class from previous code
├── result_aggregator.py # ResultAggregator class from previous code
├── error_handlers.py    # Error handling utilities
├── utils/
│   ├── __init__.py
│   ├── file_utils.py    # File handling utilities
│   └── image_utils.py   # Image processing utilities
├── models/
│   └── __init__.py      # Model weights and configurations
├── temp/               # Temporary file storage
└── logs/               # Log files
"""

# Create a file utils.py with helper functions:
"""
from pathlib import Path
import hashlib
import tempfile

def compute_file_hash(contents: bytes) -> str:
    return hashlib.sha256(contents).hexdigest()

def save_temp_file(contents: bytes) -> str:
    temp_dir = Path("temp")
    temp_file = tempfile.NamedTemporaryFile(delete=False, dir=temp_dir)
    temp_file.write(contents)
    return temp_file.name
"""