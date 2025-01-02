from groq import Groq
from typing import List, Dict
import json
from dataclasses import dataclass
from datetime import datetime
import requests
from urllib.parse import quote
from search_utils import SerperSearch
from serper_search import SerperEvidenceRetriever

@dataclass
class Claim:
    statement: str
    confidence_score: int
    verified_status: str
    key_evidence: List[str]
    sources: List[str]
    worthiness_score: int

class FactChecker:
    def __init__(self, groq_api_key: str, serper_api_key: str):
        self.client = Groq(api_key=groq_api_key)
        self.search_client = SerperEvidenceRetriever()
    
        
    def extract_claims(self, news_text: str) -> List[str]:
        prompt = {
            "role": "user",
            "content": f"Break the following news into atomic claims. Return as JSON array of claim statements:\n\n{news_text}"
        }
        
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[prompt],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)["claims"]

    def generate_verification_questions(self, claim: str) -> List[str]:
        prompt = {
            "role": "user",
            "content": f"Generate specific questions to verify this claim. Make a maximum of 5 questions for the claim. Return as JSON array:\n\n{claim}"
        }
        
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[prompt],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)["questions"]

    def search_evidence(self, query: str) -> List[Dict]:
        return self.search_client._request_serper_api(query)

    def analyze_claim(self, claim: str) -> Claim:
        # Generate verification questions
        questions = self.generate_verification_questions(claim)
        
        # Collect evidence for each question
        evidence = []
        sources = []
        i = 0
        for question in questions:
            search_results = self.search_evidence(question['question'])
            if i==0:
                print(f"res: {search_results.json()}")
            i+=1
            # evidence.extend([result["snippet"] for result in search_results])
            # sources.extend([result["link"] for result in search_results])

        # Analyze evidence using Groq
        analysis_prompt = {
            "role": "user",
            "content": f"Analyze this claim and evidence. Return JSON with confidence_score (1-100), verified_status (True/False/Partially True/Unverifiable), and worthiness_score (1-10):\n\nClaim: {claim}\n\nEvidence: {json.dumps(evidence)}"
        }
        
        analysis = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[analysis_prompt],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(analysis.choices[0].message.content)
        
        return Claim(
            statement=claim,
            confidence_score=result["confidence_score"],
            verified_status=result["verified_status"],
            key_evidence=evidence,
            sources=sources,
            worthiness_score=result["worthiness_score"]
        )

    def generate_report(self, news_text: str) -> Dict:
        claims = self.extract_claims(news_text)
        analyzed_claims = [self.analyze_claim(claim) for claim in claims]
        
        # Generate overall summary
        summary_prompt = {
            "role": "user",
            "content": f"Generate a comprehensive summary of the fact-check results. Return as JSON with summary and implications fields:\n\n{json.dumps([vars(claim) for claim in analyzed_claims])}"
        }
        
        summary = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[summary_prompt],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        return {
            "timestamp": datetime.now().isoformat(),
            "original_text": news_text,
            "claims": [vars(claim) for claim in analyzed_claims],
            "summary": json.loads(summary.choices[0].message.content)
        }
