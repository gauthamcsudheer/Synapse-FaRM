from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
import io
import os

TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
TESSDATA_PREFIX = r"C:\Program Files\Tesseract-OCR\tessdata"

os.environ["TESSDATA_PREFIX"] = TESSDATA_PREFIX
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

print("Tesseract Path:", pytesseract.pytesseract.tesseract_cmd)
print("TESSDATA_PREFIX:", os.environ.get("TESSDATA_PREFIX"))

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to restrict access
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ocr")
async def ocr(file: UploadFile, language: str = Form(...)):
    try:
        supported_languages = ["eng", "spa", "mal"]
        if language not in supported_languages:
            return {"error": f"Language {language} not supported. Choose from {supported_languages}"}

        if file.filename.lower().endswith('.pdf'):
            file_content = await file.read()
            pdf_images = convert_from_bytes(file_content)
            text = ""
            for pdf_image in pdf_images:
                text += pytesseract.image_to_string(pdf_image, lang=language)

        else:
            image = Image.open(io.BytesIO(await file.read()))
            text = pytesseract.image_to_string(image, lang=language)

        return {"text": text}

    except Exception as e:
        print(f"OCR Error: {e}")  # Log error for debugging
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"message": "Welcome to the OCR API!"}
