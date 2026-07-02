from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# from google import genai
import requests
import json
import sqlite3
from datetime import datetime
from ollama import chat



# create the FastAPI app
app = FastAPI()

# configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# CORS (Cross-Origin Resource Sharing): a SECURITY feature built into web browsers that blocks requests between different origins (domains/ports)
# the frontend is running on port 3000, while the backend is on port 8000
# basically, CORS Middleware is a communication bridge between frontend and backend



# client = genai.Client()



# sermon = "안녕하세요! 환영합니다."
# with open("sermon.txt", "r", encoding="utf-8") as file:
#     sermon = file.read()



class LoginInput(BaseModel):
    username: str
    password: str

class SermonInput(BaseModel):
    sermon: str

class SermonTranslation(BaseModel):
    title: str
    date: str
    content: str
    created_by: str

sermons_db = []



# === Database Helper Functions ===
def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect("mydatabase.db")
    conn.row_factory = sqlite3.Row # Allows accessing columns by name
    return conn



# === Root endpoint ===

# @app.get("/")
# def root():
#     return {"message": sermon}



# === Login endpoint ===

@app.post("/login")
def login(data: LoginInput):
    username = data.username
    password = data.password

    # connect to the database (connect + cursor)
    db_connection = get_db_connection()
    db_cursor = db_connection.cursor()

    # check if user exists
    db_cursor.execute("SELECT * FROM USERS WHERE username = ? AND password = ?", (username, password))
    # WHERE: filter data berdasarkan sebuah kondisi, cuma return data kalau TRUE, kalau FALSE gak return data
    user = db_cursor.fetchone() # fetchone: ambil satu data yang paling atas

    # close the connection
    db_connection.close()

    if user:
        return {
            "message": "Login successful",
            "success": True,
            "username": username
            }
    else:
        return {
            "message": "Invalid username or password",
            "success": False
            }



# === Translate Sermon endpoint ===

@app.post("/translate")
def translate_sermon(data: SermonInput):
    sermon = data.sermon

    paragraphs = sermon.split("\n")
    
    results = []
    n = 0

    for i in paragraphs:
        n += 1
        print("Translating paragraph:", n, "/", len(paragraphs))
        prompt = f"""
        Translate the following Korean sermon text into English.
        If it's Bible verse, do not translate directly. Instead, use NIV (New International Version) for the English translation.

        Text:
        {i}

        In this format:
        Korean paragraph (do not change the original Korean text)
        English paragraph

        *do not add any new paragraph or sentence, just translate the given text.
        """

        # Gemini API call
        # response = client.models.generate_content(
        #     model="gemini-2.5-flash", contents=f"{prompt}"
        # )

        print("Translated paragraph:", n, "/", len(paragraphs))

        # OpenRouter API call
        try:
            # response = requests.post(
            #     url="https://openrouter.ai/api/v1/chat/completions",
            #     headers={
            #         "Authorization": "Bearer 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",
            #         "Content-Type": "application/json",
            #     },
            #     data=json.dumps({
            #         "model": "openai/gpt-oss-120b:free",
            #         "messages": [
            #             {
            #             "role": "user",
            #             "content": prompt
            #             }
            #         ],
            #         "reasoning": {"enabled": True}
            #     })
            # )
            
            # # Extract the assistant message
            # response_json = response.json()
            # print ("API response:", response_json)

            # if 'choices' in response_json and response_json['choices']:
            #     message = response_json['choices'][0].get('message', {})
            #     results.append(message)
            
            # else:
            #     return {
            #         "error": "API response did not contain expected 'choices' key.",
            #         "details": response.json
                # }

            # messages = [{'role': 'user', 'content': f'Translate this korean sermon to english. Use NIV for the Bible verses. Translate per paragraph, make it like: \nKorean paragraph\nEnglish paragraph\nbut do not change the korean.\n---\nThe text is this\n{i}'}]

            messages = [{'role': 'user', 'content': prompt}]

            response = chat(model='translategemma:4b', messages=messages)

            results.append(response['message']['content'])

        except Exception as e:
            return {
                "error": f"Translation failed: {str(e)}"
            }
        

    return {
        "translated_text": {
            "content": results
        }
    }

    # Extract the assistant message with reasoning_details
    # response = response.json()
    # print("API response:", response)

    # if 'choices' in response and response['choices']:
    #     message = response['choices'][0].get('message', {})
    #     return {
    #         "translated_text": message
    #     }
    # else:
    #     return {
    #         "error": "API response did not contain expected 'choices' key.",
    #         "details": response
    #     }



# === Sermon Management Endpoints ===

@app.get("/sermons")
def get_sermons():
    """Fetch all sermons from the database"""
    try:
        db_connection = get_db_connection()
        db_cursor = db_connection.cursor()

        db_cursor.execute("""
            SELECT id, title, date, content, created_by, last_edited
            FROM sermons
            ORDER BY date DESC
        """)

        rows = db_cursor.fetchall()
        # rows here is a list of sqlite3.Row objects
        # sqlite3.Row objects can be accessed like dictionaries
        db_connection.close()

        # Convert rows to dictionaries
        sermons = []
        for row in rows:
            sermons.append({
                "id": row["id"],
                "title": row["title"],
                "date": row["date"],
                "content": row["content"],
                "created_by": row["created_by"],
                "last_edited": row["last_edited"],
            })
        return {"sermons": sermons}

    except Exception as e:
        print(f"Error fetching sermons: {e}")
        return { "sermons": [], "error": f"error: {e}"}


@app.post("/sermons")
def create_sermon(data: SermonTranslation):
    """Save a new sermon to the database"""
    try:
        db_connection = get_db_connection()
        db_cursor = db_connection.cursor()
        
        # Get current timestamp
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Insert the sermon
        db_cursor.execute("""
            INSERT INTO sermons (title, date, content, created_by, last_edited)
            VALUES (?, ?, ?, ?, ?)
        """, (data.title, data.date, data.content, data.created_by, current_time))
        
        db_connection.commit()
        sermon_id = db_cursor.lastrowid
        
        db_connection.close()
        
        return {
            "success": True,
            "sermon": {
                "id": sermon_id,
                "title": data.title,
                "date": data.date,
                "content": data.content,
                "created_by": data.created_by,
                "last_edited": current_time
            }
        }
    except sqlite3.IntegrityError as e:
        # Handle duplicate title error
        return {
            "success": False,
            "error": "A sermon with this title already exists. Please use a different title."
        }
    except Exception as e:
        print(f"Error saving sermon: {e}")
        return {
            "success": False,
            "error": str(e)
        }
    # sermon = {
    #     "id": len(sermons_db) +1,
    #     "title": data.title,
    #     "date": data.date,
    #     "content": data.content,
    # }
    # sermons_db.append(sermon)
    # return {"sucess": True, "sermon": sermon}


@app.delete("/sermons/{sermon_id}")
def delete_sermon(sermon_id: int):
    """Delete a sermon from the database"""
    try:
        db_connection = get_db_connection()
        db_cursor = db_connection.cursor()
        
        db_cursor.execute("DELETE FROM sermons WHERE id = ?", (sermon_id,))
        db_connection.commit()
        
        rows_deleted = db_cursor.rowcount
        db_connection.close()
        
        if rows_deleted > 0:
            return {"success": True, "message": "Sermon deleted successfully"}
        else:
            return {"success": False, "error": "Sermon not found"}
    except Exception as e:
        print(f"Error deleting sermon: {e}")
        return {"success": False, "error": str(e)}
    # global sermons_db
    # sermons_db = [s for s in sermons_db if s["id"] != sermon_id]
    # return {"sucess": True}



# uvicorn main:app --reload
# -> to run Python's program asynchronously

# uvicorn backend.main:app --reload
# -> cuma bisa dipakai ketika di luar folder backend


