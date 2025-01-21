import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./GeminiChat.css";

const GeminiChat = ({ extractedText }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    setChatbotMessages([
      ...chatbotMessages,
      { sender: "user", message: userMessage },
    ]);
    setUserMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=MY_API_KEY",
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
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);

    // Automatically adjust textarea height
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="gemini-chat-container">
      <div className="chat-messages">
        {chatbotMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "user-message" : "chatbot-message"
            }`}
          >
            {msg.sender === "chatbot" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.message}
              </ReactMarkdown>
            ) : (
              msg.message
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <textarea
          value={userMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
          rows="1"
          className="chat-textarea"
        ></textarea>
        <button onClick={handleSendMessage} disabled={isLoading || !userMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
