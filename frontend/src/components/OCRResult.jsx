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
      setChatbotResponse("I am ready to assist with the extracted text.");
    }
  }, [result]);

  return (
    <div className="ocr-result-page">
      <header className="ocr-result-header">
        <h1>OCR Results</h1>
        <button onClick={() => navigate("/ocr")} className="back-button">
          Back to OCR
        </button>
      </header>
      <div className="ocr-result-content">
        <div className="extracted-text-section">
          <h2>Extracted Text</h2>
          <textarea
            value={result}
            readOnly
            className="ocr-result-textarea"
            placeholder="No text extracted"
          />
        </div>
        <div className="chat-section">
          <h2>Chat With Your Document</h2>
          <GeminiChat extractedText={result} />
        </div>
      </div>
    </div>
  );
};

export default OCRResult;
