import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeminiChat from "./GeminiChat"; // Assuming GeminiChat is in the same directory
import "./OCRResult.css";

const OCRResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || { result: "" }; // Handle missing state
  const [chatbotResponse, setChatbotResponse] = useState("");
  
  useEffect(() => {
    if (result) {
      // Optionally, you can make a request to the Gemini API here
      setChatbotResponse("I am ready to assist with the extracted text.");
    }
  }, [result]);

  return (
    <div className="ocr-result-container">
      <h2>Extracted Text</h2>
      <textarea
        value={result}
        readOnly
        rows="20"
        cols="80"
        className="ocr-result-textarea"
      />
      <GeminiChat extractedText={result} />
      <button onClick={() => navigate("/ocr")} className="back-button">
        Back to OCR
      </button>
    </div>
  );
};

export default OCRResult;
