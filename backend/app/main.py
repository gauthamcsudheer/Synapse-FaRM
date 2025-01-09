from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import requests
from pdf2image import convert_from_path
import io

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to extract text from PDF or image
def extract_text(file_content: bytes, file_type: str):
    if file_type == 'pdf':
        images = convert_from_path(io.BytesIO(file_content))
        text = ""
        for img in images:
            text += pytesseract.image_to_string(img)
        return text
    elif file_type == 'image':
        img = Image.open(io.BytesIO(file_content))
        return pytesseract.image_to_string(img)
    return ""

# Function to interact with the Gemini API
def query_gemini(query: str, context: str):
    url = "https://api.google.com/gemini/ask"  # Example URL (replace with the actual API URL)
    headers = {
        "Authorization": "Bearer AIzaSyCEifdgxuEBQ5jU-TzAN5xFz6OgBhZi7gw"
    }
    data = {
        "query": query,
        "context": context
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()["answer"]
    else:
        return "Sorry, I couldn't get an answer."

@app.post("/ocr")
async def ocr(file: UploadFile, file_type: str = Form(...), query: str = Form(...)):
    try:
        file_content = await file.read()
        
        # Extract text from the uploaded file
        extracted_text = extract_text(file_content, file_type)
        
        # Query Gemini API to get an answer based on the extracted text
        answer = query_gemini(query, extracted_text)
        
        return {"extracted_text": extracted_text, "answer": answer}
    except Exception as e:
        return {"error": str(e)}
