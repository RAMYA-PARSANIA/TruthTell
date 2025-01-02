from groq import Groq
from .base import BaseClient
import time
import os
import dotenv

dotenv.load_dotenv()

class LlamaClient(BaseClient):
    def __init__(
        self,
        model: str = "llama-3.3-70b-versatile",
        api_config: dict = None,
        max_requests_per_minute=60,
        request_window=60,
        temperature: float = 0.7
    ):
        super().__init__(model, api_config, max_requests_per_minute, request_window)
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.temperature = temperature

    def _call(self, messages: str, **kwargs):
        print(f"Messages: {messages}")
        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": messages}],
            model=self.model,
            temperature=self.temperature,
            max_tokens=2048,
            stream=False,
            response_format={"type": "json_object"}
        )
        if response.choices:
            return response.choices[0].message
        return ""

    def get_request_length(self, messages):
        return 1
    
    def _log_usage(self, response):
        try:
            self.usage.prompt_tokens += response.usage.prompt_tokens
            self.usage.completion_tokens += response.usage.completion_tokens
        except:
            print("Warning: Usage tracking not available for this response")

    def construct_message_list(
        self,
        prompt_list: list[str],
        system_role: str = None,
    ):
        messages_list = []
        for prompt in prompt_list:
            messages_list.append({"role": "user", "content": prompt})
            
        return messages_list
