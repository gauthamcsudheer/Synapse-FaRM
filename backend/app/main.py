from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
import io

app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ocr")
async def ocr(file: UploadFile, language: str = Form(...)):
    try:
        # Check if the language is supported
        supported_languages = ["eng", "spa", "fra"]
        if language not in supported_languages:
            return {"error": f"Language {language} not supported. Please use one of {supported_languages}"}

        # Handle PDF file
        if file.filename.lower().endswith('.pdf'):
            file_content = await file.read()
            # Convert PDF to images
            pdf_images = convert_from_bytes(file_content)
            text = ""
            # Iterate over the converted PDF pages
            for pdf_image in pdf_images:
                text += pytesseract.image_to_string(pdf_image, lang=language)

        # Handle image file
        else:
            image = Image.open(io.BytesIO(await file.read()))
            text = pytesseract.image_to_string(image, lang=language)

        return {"text": text}

    except Exception as e:
        return {"error": str(e)}
