import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MultilingualOCR.css";

const MultilingualOCR = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("eng");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file!");
      return;
    }

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
        navigate("/ocr-result", { state: { result: data.text } }); // Redirect to the result page
      } else {
        alert("Error: " + (data.error || "Failed to extract text."));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="ocr-container">
      <h2>Multilingual OCR</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="eng">English</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          {/* Add more languages as needed */}
        </select>
        <button type="submit">Extract</button>
      </form>
    </div>
  );
};

export default MultilingualOCR;
