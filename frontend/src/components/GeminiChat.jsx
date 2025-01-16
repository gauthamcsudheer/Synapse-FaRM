import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./GeminiChat.css";

const GeminiChat = ({ extractedText }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    setChatbotMessages([
      ...chatbotMessages,
      { sender: "user", message: userMessage },
    ]);
    setUserMessage("");
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCEifdgxuEBQ5jU-TzAN5xFz6OgBhZi7gw",
        {
          contents: [
            {
              parts: [
                {
                  text: `${extractedText} \nUser query: ${userMessage}`,
                },
              ],
            },
          ],
        }
      );

      const geminiMessage = response.data.candidates[0].content.parts[0].text;
      setChatbotMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatbot", message: geminiMessage },
      ]);
      setIsLoading(false); // Stop loading when response is received
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setIsLoading(false); // Stop loading in case of error
    }
  };

  return (
    <div className="gemini-chat-container">
      <div className="chat-messages">
        {chatbotMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user-message" : "chatbot-message"}`}
          >
            {msg.sender === "chatbot" ? (
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            ) : (
              msg.message
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GeminiChat;
