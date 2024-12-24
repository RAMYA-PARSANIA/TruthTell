#client for gemini
from .base import BaseClient
import time
from google.generativeai import GenerativeModel
import google.generativeai as genai
import os
import dotenv

dotenv.load_dotenv()

class GeminiClient(BaseClient):
    def __init__(
        self,
        model: str = "gemini-2.0-flash-exp",
        api_config: dict = None,
        max_requests_per_minute=60,
        request_window=60,
        seed: int = 42,
        temperature: float = 0.7
    ):
        super().__init__(model, api_config, max_requests_per_minute, request_window)
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.seed = seed
        self.temperature = temperature
        self.client = GenerativeModel(
            model_name=self.model
        )

    def _call(self, messages: str, **kwargs):
        response = self.client.generate_content(
            messages,
            generation_config={
                'max_output_tokens': 2048,
                'temperature': self.temperature,
                "response_mime_type": "application/json"
            }
        )
        if response.parts:
            return response.text
        return ""

    def get_request_length(self, messages):
        return 1
    
    def _log_usage(self, response):
        try:
            # Gemini provides usage metrics differently
            # Add when available through the API
            self.usage.prompt_tokens += response.usage.prompt_tokens
            self.usage.completion_tokens += response.usage.completion_tokens
        except:
            print("Warning: Usage tracking not available for Gemini")


    def construct_message_list(
    self,
    prompt_list: list[str],
    system_role: str = None,
):
        if system_role:
            print("Note: Gemini handles system prompts differently - incorporating into user message")
        
        messages_list = []
        for prompt in prompt_list:
            # If system role exists, we can prepend it to the prompt
            full_prompt = f"{system_role}\n\n{prompt}" if system_role else prompt
            messages_list.append(full_prompt)
        return messages_list
