import requests
import json
import speech_recognition as sr
from typing import Union, Dict, List
from dotenv import load_dotenv
import os

load_dotenv()

class FactCheckService:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.fact_check_endpoint = os.getenv("FACT_CHECK_URL")
        self.recognizer = sr.Recognizer()

    def process_voice_input(self, audio_file_path: str) -> str:
        """Convert voice input to text using speech recognition."""
        with sr.AudioFile(audio_file_path) as source:
            audio = self.recognizer.record(source)
            try:
                text = self.recognizer.recognize_google(audio)
                return text
            except sr.UnknownValueError:
                raise ValueError("Could not understand audio")
            except sr.RequestError:
                raise ConnectionError("Could not connect to speech recognition service")

    def check_facts(self, input_content: Union[str, bytes], content_type: str = "text") -> List[Dict]:
        """
        Check facts from either text or voice input.
            
        Args:
            input_content: Either text string or path to audio file
            content_type: "text" or "voice"
            
        Returns:
            List of fact check results
        """
        # Convert voice to text if needed
        if content_type == "voice":
            text_content = self.process_voice_input(input_content)
        else:
            text_content = input_content

        # Prepare API request
        print(text_content)
        params = {
            "key": self.google_api_key,
            "query": text_content,
            "languageCode": "en"
        }

        try:
            response = requests.get(self.fact_check_endpoint, params=params)
            response.raise_for_status()
            
            print(response.json())
            results = response.json().get("claims", [])
            
            # Process and format results
            fact_check_results = []
            for result in results:
                fact_check_results.append({
                    "claim": result.get("text", ""),
                    "claimant": result.get("claimant", "Unknown"),
                    "fact_checker": result.get("claimReview", [{}])[0].get("publisher", {}).get("name", "Unknown"),
                    "rating": result.get("claimReview", [{}])[0].get("textualRating", "Unknown"),
                    "url": result.get("claimReview", [{}])[0].get("url", "")
                })
            
            return fact_check_results
            
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"Error connecting to fact check API: {str(e)}")

    def analyze_credibility(self, results: List[Dict]) -> Dict:
        """
        Analyze the credibility of the claim based on fact check results.
        
        Args:
            results: List of fact check results
            
        Returns:
            Dictionary with credibility analysis
        """
        if not results:
            return {"credibility": "Unknown", "confidence": 0, "message": "No fact checks found"}
        
        # Count different ratings
        ratings = [result["rating"].lower() for result in results]
        true_counts = sum(1 for r in ratings if "true" in r or "accurate" in r)
        false_counts = sum(1 for r in ratings if "false" in r or "inaccurate" in r)
        
        total = len(results)
        confidence = max(true_counts, false_counts) / total if total > 0 else 0
        
        if true_counts > false_counts:
            credibility = "Likely True"
        elif false_counts > true_counts:
            credibility = "Likely False"
        else:
            credibility = "Disputed"
            
        return {
            "credibility": credibility,
            "confidence": round(confidence * 100, 2),
            "message": f"Based on {total} fact checks",
            "true_claims": true_counts,
            "false_claims": false_counts
        }

if __name__ == "__main__":
    factChecker = FactCheckService()
    String = "The earth is not flat"
    results = factChecker.check_facts(String, "text")
    print(results)