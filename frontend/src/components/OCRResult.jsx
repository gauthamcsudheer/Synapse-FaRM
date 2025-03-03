import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeminiChat from "./GeminiChat";
import "./OCRResult.css";

const OCRResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, id } = location.state || { result: "", id: null };

  const [extractedTexts, setExtractedTexts] = useState(() => {
    return JSON.parse(localStorage.getItem("ocrHistory")) || [];
  });

  useEffect(() => {
    if (result && id) {
      const exists = extractedTexts.some((entry) => entry.id === id);
      if (!exists) {
        const newExtractedText = { id, text: result };
        const updatedTexts = [newExtractedText, ...extractedTexts];

        setExtractedTexts(updatedTexts);
        localStorage.setItem("ocrHistory", JSON.stringify(updatedTexts));
      }
    }
  }, [result, id]);

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
          <div className="ocr-text-container">
            <pre>{result}</pre>
          </div>
        </div>

        <div className="chat-section">
          <h2>Chat With Your Document</h2>
          <GeminiChat extractedText={result} docId={id} />
        </div>
      </div>
    </div>
  );
};

export default OCRResult;
