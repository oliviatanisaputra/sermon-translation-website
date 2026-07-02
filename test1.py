# from google import genai

# # The client gets the API key from the environment variable `GEMINI_API_KEY`.
# client = genai.Client()

# response = client.models.generate_content(
#     model="gemini-2.5-flash", contents="Explain how AI works in a few words"
# )
# print(response.text)



with open("originalsermon1.txt", "r") as file:
    originalsermon = file.read()
# print(originalsermon)

paragraphs = originalsermon.split("\n\n")

for i in paragraphs:
    print(i)
    print("\n-----\n")