from ollama import chat
from pwdlib import PasswordHash


# with open("originalsermon1.txt", "r", encoding="utf-8") as file:
#     sermon = file.read()

# messages = [
#     {'role': 'user', 'content': f'Translate this korean sermon to english. Use NIV for the Bible verses. Translate per paragraph, make it like: \nKorean paragraph\nEnglish paragraph\nbut do not change the korean.\n---\n{sermon}'},
# ]

# response = chat(model='gemma3:4b', messages=messages)
# print(response['message']['content'])



# Initialize with default recommended settings (Argon2)
password_hash = PasswordHash.recommended()

# Hash a raw password string
hashed_password = password_hash.hash("huhu")
print(hashed_password) 