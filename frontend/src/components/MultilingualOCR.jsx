import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MultilingualOCR.css";

const MultilingualOCR = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("eng");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTexts, setExtractedTexts] = useState(() => {
    return JSON.parse(localStorage.getItem("ocrHistory")) || [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("ocrHistory", JSON.stringify(extractedTexts));
  }, [extractedTexts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.text) {
        const newExtractedText = { id: Date.now(), text: data.text };
        setExtractedTexts((prev) => [newExtractedText, ...prev]);

        // Navigate with the extracted text and unique ID
        navigate("/ocr-result", { state: { result: data.text, id: newExtractedText.id } });
      } else {
        alert("Error: " + (data.error || "Failed to extract text."));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="ocr-container">
        <h2 className="ocr-title">Multilingual OCR</h2>
        <p className="ocr-description">
          Upload an image or PDF, select a language, and extract the text instantly.
        </p>
        <form className="ocr-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file" className="form-label">Upload File</label>
            <input
              id="file"
              type="file"
              accept="image/*,application/pdf"
              className="form-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label htmlFor="language" className="form-label">Select Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input"
            >
              <option value="eng">English</option>
              <option value="spa">Spanish</option>
              <option value="mal">Malayalam</option>
            </select>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Extract Text"}
          </button>
        </form>
      </div>

      {extractedTexts.length > 0 && (
        <div className="extracted-history">
          <h3>Previous Extractions</h3>
          <div className="ocr-cards-container">
            {extractedTexts.map((item) => (
              <div key={item.id} className="ocr-card">
                <p className="ocr-card-text">{item.text.substring(0, 100)}...</p>
                <button 
                  className="ocr-view-button" 
                  onClick={() => navigate("/ocr-result", { state: { result: item.text, id: item.id } })}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MultilingualOCR;
