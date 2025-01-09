import React, { useState } from 'react';
import './MultilingualOCR.css';

const MultilingualOCR = () => {
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState('eng');
    const [ocrResult, setOcrResult] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleExtract = async () => {
        if (!file) {
            setError('Please select an image or PDF.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', language);

        setIsLoading(true);
        setError('');
        setOcrResult('');

        try {
            const response = await fetch('http://localhost:8000/api/ocr', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setOcrResult(data.text);
            } else {
                const data = await response.json();
                setError(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ocr-container">
            <h1 className="ocr-title">Multilingual OCR</h1>
            <div className="ocr-form">
                <div className="ocr-file-input">
                    <label htmlFor="file" className="ocr-label">Select an Image or PDF</label>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="ocr-input" />
                </div>
                <div className="ocr-language-select">
                    <label htmlFor="language" className="ocr-label">Choose Language</label>
                    <select value={language} onChange={handleLanguageChange} className="ocr-select">
                        <option value="eng">English</option>
                        <option value="spa">Spanish</option>
                        <option value="fra">French</option>
                        {/* Add more languages */}
                    </select>
                </div>
                <button onClick={handleExtract} className="ocr-btn" disabled={isLoading}>
                    {isLoading ? 'Extracting...' : 'Extract Text'}
                </button>
            </div>
            {error && <div className="ocr-error">{error}</div>}
            {ocrResult && (
                <div className="ocr-result">
                    <h3>OCR Result:</h3>
                    <pre>{ocrResult}</pre>
                </div>
            )}
        </div>
    );
};

export default MultilingualOCR;
