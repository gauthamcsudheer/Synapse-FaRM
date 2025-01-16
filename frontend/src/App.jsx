import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MultilingualOCR from "./components/MultilingualOCR";
import OCRResult from "./components/OCRResult";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ocr" element={<MultilingualOCR />} />
        <Route path="/ocr-result" element={<OCRResult />} />
      </Routes>
    </Router>
  );
};

export default App;
