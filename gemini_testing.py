from google import genai
# import sermon.txt as SermonTxt

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

sermon = ""
with open("sermon.txt", "r", encoding="utf-8") as file:
    sermon = file.read()


text = f"""
{sermon}
"""

prompt = f"""
Translate the following Korean sermon text into English. Use NIV for the Bible verses.

Text:
{text}

In this format:
Korean paragraph
English paragraph
"""

response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f"{prompt}"
)



print(response.text)