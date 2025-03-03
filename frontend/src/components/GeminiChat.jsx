import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./GeminiChat.css";

const GeminiChat = ({ extractedText, docId }) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!docId) return;

    const chatKey = `chatHistory_${docId}`;
    const storedChat = JSON.parse(localStorage.getItem(chatKey)) || [];

    console.log("Loaded chat history:", storedChat); // Debugging log

    setChatbotMessages(storedChat);
  }, [docId]);

  useEffect(() => {
    if (!docId || chatbotMessages.length === 0) return;

    const chatKey = `chatHistory_${docId}`;
    console.log("Saving chat history:", chatbotMessages); // Debugging log
    localStorage.setItem(chatKey, JSON.stringify(chatbotMessages));
  }, [chatbotMessages, docId]);

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    const newMessages = [...chatbotMessages, { sender: "user", message: userMessage }];
    setChatbotMessages(newMessages);
    setUserMessage("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: `Document Context:\n${extractedText}\n\nUser query: ${userMessage}` },
              ],
            },
          ],
        }
      );

      const botResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

      console.log("Bot Response:", botResponse); // Debugging log

      const updatedMessages = [...newMessages, { sender: "chatbot", message: botResponse }];
      setChatbotMessages(updatedMessages);
      localStorage.setItem(`chatHistory_${docId}`, JSON.stringify(updatedMessages)); // Ensure sync update
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatbotMessages([
        ...newMessages,
        { sender: "chatbot", message: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="gemini-chat-container">
      <div className="chat-messages">
        {chatbotMessages.length === 0 ? (
          <p className="empty-chat">No messages yet. Start the conversation!</p>
        ) : (
          chatbotMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "chatbot-message"}`}>
              {msg.sender === "chatbot" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
              ) : (
                msg.message
              )}
            </div>
          ))
        )}
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
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows="1"
          className="chat-textarea"
        ></textarea>
        <button onClick={handleSendMessage} disabled={isLoading || !userMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
