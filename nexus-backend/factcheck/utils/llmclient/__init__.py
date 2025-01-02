from .gpt_client import GPTClient
from .claude_client import ClaudeClient
from .local_openai_client import LocalOpenAIClient
from .gemini_client import GeminiClient
from .llama_client import LlamaClient

# fmt: off
CLIENTS = {
    "llama": LlamaClient
}
# fmt: on


def model2client(model_name: str):
    """If the client is not specified, use this function to map the model name to the corresponding client."""
    if model_name.startswith("gpt"):
        return GPTClient
    elif model_name.startswith("claude"):
        return ClaudeClient
    elif model_name.startswith("vicuna"):
        return LocalOpenAIClient
    elif model_name.startswith("gemini"):
        return GeminiClient
    elif model_name.startswith("llama"):
        print(f"Using llama client")
        return GeminiClient
    else:
        raise ValueError(f"Model {model_name} not supported.")