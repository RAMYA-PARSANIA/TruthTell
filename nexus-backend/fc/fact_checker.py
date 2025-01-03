from groq import Groq
import os
import dotenv
import google.generativeai as genai
from typing import List, Dict
import json
from dataclasses import dataclass
from datetime import datetime
import requests
from urllib.parse import quote
from serper_search import SerperEvidenceRetriever
from google.ai.generativelanguage_v1beta.types import content
import time

dotenv.load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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
        generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_schema": content.Schema(
            type = content.Type.OBJECT,
            enum = [],
            required = ["overall_analysis", "claim_analysis", "meta_analysis"],
            properties = {
            "overall_analysis": content.Schema(
                type = content.Type.OBJECT,
                enum = [],
                required = ["truth_score", "reliability_assessment", "key_findings", "patterns_identified"],
                properties = {
                "truth_score": content.Schema(
                    type = content.Type.NUMBER,
                ),
                "reliability_assessment": content.Schema(
                    type = content.Type.STRING,
                ),
                "key_findings": content.Schema(
                    type = content.Type.ARRAY,
                    items = content.Schema(
                    type = content.Type.STRING,
                    ),
                ),
                "patterns_identified": content.Schema(
                    type = content.Type.ARRAY,
                    items = content.Schema(
                    type = content.Type.STRING,
                    ),
                ),
                },
            ),
            "claim_analysis": content.Schema(
                type = content.Type.ARRAY,
                items = content.Schema(
                type = content.Type.OBJECT,
                properties = {
                    "claim": content.Schema(
                    type = content.Type.STRING,
                    ),
                    "verification_status": content.Schema(
                    type = content.Type.STRING,
                    ),
                    "confidence_level": content.Schema(
                    type = content.Type.NUMBER,
                    ),
                    "evidence_quality": content.Schema(
                    type = content.Type.OBJECT,
                    properties = {
                        "strength": content.Schema(
                        type = content.Type.NUMBER,
                        ),
                        "gaps": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                        "contradictions": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                    },
                    ),
                    "source_assessment": content.Schema(
                    type = content.Type.ARRAY,
                    items = content.Schema(
                        type = content.Type.OBJECT,
                        properties = {
                        "url": content.Schema(
                            type = content.Type.STRING,
                        ),
                        "credibility_metrics": content.Schema(
                            type = content.Type.OBJECT,
                            properties = {
                            "credibility_score": content.Schema(
                                type = content.Type.NUMBER,
                            ),
                            "bias_rating": content.Schema(
                                type = content.Type.STRING,
                            ),
                            "fact_checking_history": content.Schema(
                                type = content.Type.NUMBER,
                            ),
                            },
                        ),
                        "relevance_to_claim": content.Schema(
                            type = content.Type.NUMBER,
                        ),
                        },
                    ),
                    ),
                    "misinformation_impact": content.Schema(
                    type = content.Type.OBJECT,
                    properties = {
                        "severity": content.Schema(
                        type = content.Type.NUMBER,
                        ),
                        "affected_domains": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                        "potential_consequences": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                        "spread_risk": content.Schema(
                        type = content.Type.NUMBER,
                        ),
                    },
                    ),
                    "correction_suggestions": content.Schema(
                    type = content.Type.OBJECT,
                    properties = {
                        "verified_facts": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                        "recommended_sources": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.OBJECT,
                            properties = {
                            "url": content.Schema(
                                type = content.Type.STRING,
                            ),
                            "credibility_score": content.Schema(
                                type = content.Type.NUMBER,
                            ),
                            "relevance": content.Schema(
                                type = content.Type.NUMBER,
                            ),
                            },
                        ),
                        ),
                        "context_missing": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                        ),
                    },
                    ),
                },
                ),
            ),
            "meta_analysis": content.Schema(
                type = content.Type.OBJECT,
                properties = {
                "information_ecosystem_impact": content.Schema(
                    type = content.Type.STRING,
                ),
                "recommended_actions": content.Schema(
                    type = content.Type.ARRAY,
                    items = content.Schema(
                    type = content.Type.STRING,
                    ),
                ),
                "prevention_strategies": content.Schema(
                    type = content.Type.ARRAY,
                    items = content.Schema(
                    type = content.Type.STRING,
                    ),
                ),
                },
            ),
            },
        ),
        "response_mime_type": "application/json",
        }

        generation_config_sources = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_schema": content.Schema(
            type = content.Type.OBJECT,
            enum = [],
            required = ["credibility_score", "fact_checking_history", "transparency_score", "expertise_level", "brief_explanation"],
            properties = {
            "credibility_score": content.Schema(
                type = content.Type.INTEGER,
            ),
            "fact_checking_history": content.Schema(
                type = content.Type.INTEGER,
            ),
            "transparency_score": content.Schema(
                type = content.Type.INTEGER,
            ),
            "expertise_level": content.Schema(
                type = content.Type.INTEGER,
            ),
            "brief_explanation": content.Schema(
                type = content.Type.STRING,
            ),
            "additional_metrics": content.Schema(
                type = content.Type.OBJECT,
                properties = {
                "citation_score": content.Schema(
                    type = content.Type.INTEGER,
                ),
                "peer_recognition": content.Schema(
                    type = content.Type.INTEGER,
                ),
                },
            ),
            },
        ),
        "response_mime_type": "application/json",
        }


        self.client = Groq(api_key=groq_api_key)
        self.search_client = SerperEvidenceRetriever(api_key=serper_api_key)
        
        self.gemini_client = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )
        self.gemini_chat = self.gemini_client.start_chat(
            history=[]
        )

        self.source_correction = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config_sources,
        )
        self.gemini_chat_sources = self.source_correction.start_chat(
            history=[]
        )
        
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
        return self.search_client.retrieve_evidence(query)

    def analyze_claim(self, claim: str) -> Claim:
        # Generate verification questions
        questions = self.generate_verification_questions(claim=claim)

        claim_queries_dict = {claim: [q['question'] for q in questions]}

        evidence_dict = self.search_client.retrieve_evidence(claim_queries_dict=claim_queries_dict)
        
        # Collect evidence for each question
        evidences = []
        sources = []
        
        for claim, evidence in evidence_dict.items():
            for evidence_item in evidence:
                evidences.append(evidence_item['text'])
                sources.append(evidence_item['url'])
        
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
        analyzed_claims = []
        for claim in claims:
            cl = ""
            for tup in claim.items():
                cl += tup[1] + " "
            analyzed_claims.append(self.analyze_claim(claim=cl))

        
        # # Source credibility analysis
        # source_ratings = {}
        # for claim in analyzed_claims:
        #     for source in claim.sources:
        #         if source not in source_ratings:
        #             credibility_prompt = f"""Analyze this source's credibility: {source}
        #             Return a JSON with:
        #             - credibility_score (1-100)
        #             - bias_rating (Left/Center/Right)
        #             - fact_checking_history (1-100)
        #             - transparency_score (1-100)
        #             - expertise_level (1-100)
        #             - brief_explanation of the rating"""
                    
        #             source_analysis = self.source_correction.generate_content(credibility_prompt)
        #             source_ratings[source] = json.loads(source_analysis.text)

        # #sleep for one minute
        # time.sleep(60)

        report_prompt = f"""Generate a comprehensive fact-check analysis report for the following claims and evidence. 
        Return a detailed JSON with the following structure:

        {{
            "overall_analysis": {{
                "truth_score": float,
                "reliability_assessment": string,
                "key_findings": [string],
                "patterns_identified": [string]
            }},
            "claim_analysis": [{{
                "claim": string,
                "verification_status": string,
                "confidence_level": float,
                "evidence_quality": {{
                    "strength": float,
                    "gaps": [string],
                    "contradictions": [string]
                }},
                "source_assessment": [{{
                    "url": string,
                    "credibility_metrics": object,
                    "relevance_to_claim": float
                }}],
                "misinformation_impact": {{
                    "severity": float,
                    "affected_domains": [string],
                    "potential_consequences": [string],
                    "spread_risk": float
                }},
                "correction_suggestions": {{
                    "verified_facts": [string],
                    "recommended_sources": [{{
                        "url": string,
                        "credibility_score": float,
                        "relevance": float
                    }}],
                    "context_missing": [string]
                }}
            }}],
            "meta_analysis": {{
                "information_ecosystem_impact": string,
                "recommended_actions": [string],
                "prevention_strategies": [string]
            }}
        }}

        Claims and Evidence: {json.dumps([vars(claim) for claim in analyzed_claims])}
        
        """
        # Source Ratings: {json.dumps(source_ratings)}
        # Get additional correction sources for misinfo claims
        correction_sources = {}
        for claim in analyzed_claims:
            if claim.verified_status.lower() in ['false', 'partially true']:
                correction_query = f"fact check {claim.statement} reliable sources"
                correction_results = self.search_client.retrieve_evidence({claim.statement: [correction_query]})
                correction_sources[claim.statement] = correction_results

        enhanced_report = self.gemini_client.generate_content(report_prompt)
        report_content = json.loads(enhanced_report.text)
            # "source_credibility": source_ratings,
        
        return {
            "timestamp": datetime.now().isoformat(),
            "original_text": news_text,
            "detailed_analysis": report_content,
            "correction_sources": correction_sources
        }