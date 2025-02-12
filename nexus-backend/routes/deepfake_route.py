from fastapi import Depends, APIRouter, UploadFile, File, HTTPException
from db.init_db import Database
from pydantic import BaseModel
from .auth import get_current_user
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from PIL.ExifTags import TAGS
import tempfile

deepfake_router = APIRouter()

class DeepfakeDetector:
    def __init__(self):
        model_path = "C:/ForKrishna/forKrishnaFolder/TruthTell/nexus-backend/deepfake2/deepfake_detector.h5"
        self.model = load_model(model_path)
        self.img_height = 128
        self.img_width = 128

    def predict_image(self, img_path):
        if not os.path.exists(img_path):
            raise HTTPException(status_code=404, detail="Image file not found")
        
        img = image.load_img(img_path, target_size=(self.img_height, self.img_width))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prediction = self.model.predict(img_array)
        return "Fake" if prediction[0][0] > 0.5 else "Real"

    def check_metadata(self, img_path):
        try:
            img = Image.open(img_path)
            exif_data = img._getexif()
            if not exif_data:
                return "Fake (missing metadata)"
            metadata = {TAGS.get(tag): value for tag, value in exif_data.items() if tag in TAGS}
            return "Real (metadata present)" if metadata else "Fake (missing metadata)"
        except Exception as e:
            return f"Error analyzing metadata: {str(e)}"

    def analyze_artifacts(self, img_path):
        try:
            img = cv2.imread(img_path)
            img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
            mean_var = np.mean(np.var(laplacian))
            return "Fake (high artifact density)" if mean_var > 10 else "Real"
        except Exception as e:
            return f"Error analyzing artifacts: {str(e)}"

    def detect_noise_patterns(self, img_path):
        try:
            img = cv2.imread(img_path)
            img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            noise_std = np.std(img_gray)
            return "Fake (unnatural noise patterns)" if noise_std < 5 else "Real"
        except Exception as e:
            return f"Error analyzing noise patterns: {str(e)}"

    def calculate_symmetry(self, img_path):
        try:
            img = cv2.imread(img_path)
            img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img_flipped_v = cv2.flip(img_gray, 1)
            img_flipped_h = cv2.flip(img_gray, 0)
            vertical_symmetry = 1 - np.mean(np.abs(img_gray - img_flipped_v)) / 255
            horizontal_symmetry = 1 - np.mean(np.abs(img_gray - img_flipped_h)) / 255
            return {
                "Vertical Symmetry": round(vertical_symmetry, 2),
                "Horizontal Symmetry": round(horizontal_symmetry, 2)
            }
        except Exception as e:
            return {"Error": str(e)}

    async def analyze_image(self, img_path):
        results = {}
        
        cnn_prediction = self.predict_image(img_path)
        results["CNN Prediction"] = cnn_prediction
        cnn_score = 1 if cnn_prediction == "Fake" else 0
        
        metadata_result = self.check_metadata(img_path)
        results["Metadata Analysis"] = metadata_result
        metadata_score = 1 if "Fake" in metadata_result else 0
        
        artifact_result = self.analyze_artifacts(img_path)
        results["Artifact Analysis"] = artifact_result
        artifact_score = 1 if "Fake" in artifact_result else 0
        
        noise_result = self.detect_noise_patterns(img_path)
        results["Noise Pattern Analysis"] = noise_result
        noise_score = 1 if "Fake" in noise_result else 0
        
        symmetry_results = self.calculate_symmetry(img_path)
        results["Symmetry Analysis"] = symmetry_results
        
        vertical_symmetry = symmetry_results.get("Vertical Symmetry", 0)
        horizontal_symmetry = symmetry_results.get("Horizontal Symmetry", 0)
        symmetry_score = 0
        if vertical_symmetry != "Unknown" and horizontal_symmetry != "Unknown":
            if vertical_symmetry > 0.9 or horizontal_symmetry > 0.9:
                symmetry_score = 1

        total_score = (cnn_score * 0.4 + metadata_score * 0.1 +
                      artifact_score * 0.15 + noise_score * 0.15 +
                      symmetry_score * 0.2)
                      
        results["Final Prediction"] = "Fake" if total_score > 0.5 else "Real"
        results["Confidence Score"] = round(total_score, 2)
        
        return results

detector = DeepfakeDetector()

@deepfake_router.post("/analyze-deepfake")
async def analyze_image(
    file: UploadFile = File(...)
):
    try:
        # Create a temporary file to store the uploaded image
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = "C:/Users/kveli/Downloads/wallpaper_opps_phone.png"#temp_file.name

        # Analyze the image
        results = await detector.analyze_image(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return {"status": "success", "results": results}
    
    except Exception as e:
        # Clean up the temporary file if it exists
        if 'temp_file_path' in locals():
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))