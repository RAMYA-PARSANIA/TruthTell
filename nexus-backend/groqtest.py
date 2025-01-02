from groq import Groq
import os
import dotenv
dotenv.load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
models = client.models.list()
for model in models:
    print(f"Model ID: {model}")

while True:
    user_input = input("Enter your message: ")
    response = client.chat.completions.create(
            messages=[{"role": "user", "content": user_input}],
            model='llama-3.3-70b-versatile',
            temperature=1,
            max_tokens=2048,
            stream=False,
            response_format={"type": "json_object"}
        )
    print(response.choices[0].message)
