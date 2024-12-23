#client for gemini
from .base import BaseClient
import time
from google.generativeai import GenerativeModel
import google.generativeai as genai

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
        genai.configure(api_key=self.api_config["GEMINI_API_KEY"])
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
                'seed': self.seed
            }
        )
        if response.parts:
            return response.text
        return ""

    def get_request_length(self, messages):
        return 1

    def construct_message_list(
        self,
        prompt_list: list[str],
        system_role: str = None,
    ):
        if system_role:
            Warning("system_role is not supported by Gemini")
        
        messages_list = []
        for prompt in prompt_list:
            messages_list.append(prompt)
        return messages_list