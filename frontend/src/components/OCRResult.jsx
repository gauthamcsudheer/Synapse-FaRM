import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OCRResult.css";

const OCRResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || { result: "" }; // Handle missing state

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
      <button onClick={() => navigate("/ocr")} className="back-button">
        Back to OCR
      </button>
    </div>
  );
};

export default OCRResult;
