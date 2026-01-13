from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import requests
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = genai.Client()

# sermon = "안녕하세요! 환영합니다."
# with open("sermon.txt", "r", encoding="utf-8") as file:
#     sermon = file.read()


class SermonInput(BaseModel):
    sermon: str

@app.get("/")
def root():
    return {"message": sermon}

@app.post("/translate")
def translate_sermon(data: SermonInput):

    sermon = data.sermon

    # text = f"""
    # {sermon}
    # """

    prompt = f"""
    Translate the following Korean sermon text into English.
    If it's Bible verse, do not translate directly. Instead, use NIV (New International Version) for the English translation.

    Text:
    {sermon}

    In this format:
    Korean paragraph
    English paragraph
    """


    # Gemini API call
    # response = client.models.generate_content(
    #     model="gemini-2.5-flash", contents=f"{prompt}"
    # )


    # OpenRouter API call
    response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "openai/gpt-oss-120b:free",
        "messages": [
            {
            "role": "user",
            "content": prompt
            }
        ],
        "reasoning": {"enabled": True}
    })
    )

    # Extract the assistant message with reasoning_details
    response = response.json()
    print(response)
    response = response['choices'][0]['message']


    return {
        # "translated_text": response.text
        "translated_text": response
    }


# uvicorn backend.main:app --reload
# -> to run Python's program asynchronously


