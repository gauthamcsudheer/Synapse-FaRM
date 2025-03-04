import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeminiChat from "./GeminiChat";
import { Volume2 } from "lucide-react"; // Speaker Icon
import "./OCRResult.css";

const OCRResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, id } = location.state || { result: "", id: null };

  const [extractedTexts, setExtractedTexts] = useState(() => {
    return JSON.parse(localStorage.getItem("ocrHistory")) || [];
  });

  const [speaking, setSpeaking] = useState(false);

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

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
  
    const splitTextIntoChunks = (text, maxChunkLength = 200) => {
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Split by sentence
      const chunks = [];
      let currentChunk = "";
  
      sentences.forEach((sentence) => {
        if ((currentChunk + sentence).length > maxChunkLength) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += " " + sentence;
        }
      });
  
      if (currentChunk) chunks.push(currentChunk.trim());
      return chunks;
    };
  
    const speakChunks = (chunks, index = 0) => {
      if (index >= chunks.length) {
        setSpeaking(false);
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.rate = 1.2;
      
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.name.includes("Google UK English Female"));
      if (selectedVoice) utterance.voice = selectedVoice;
  
      utterance.onend = () => speakChunks(chunks, index + 1);
      utterance.onerror = (err) => {
        console.error("Speech synthesis error:", err);
        setSpeaking(false);
      };
  
      window.speechSynthesis.speak(utterance);
    };
  
    const textChunks = splitTextIntoChunks(result);
    if (textChunks.length > 0) {
      setSpeaking(true);
      speakChunks(textChunks);
    }
  };  

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
          <div className="extracted-text-header">
            <h2>Extracted Text</h2>
            <button className="tts-button" onClick={handleSpeak}>
              <Volume2 size={20} className={speaking ? "active" : ""} />
            </button>
          </div>
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
