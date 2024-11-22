// PlanItAssistant.jsx 
// PlanItFamIt's Smart Chatbot using Gemini
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Pages/ChatbotStyle.css';
import { FaRobot, FaSync, FaPaperPlane, FaUser, FaCompress, FaExpand, FaArrowLeft } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCZKZbTGaRVNnDnhaLJ84fO8kdrANVVDM8"; // Add your Google API key here
const MODEL_NAME = "gemini-1.5-pro";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const chat = model.startChat({
  history: [],
});

const PlanItAssistant = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatList, setChatList] = useState([{ message: "Hi there! I am PlanIt Assistant. How may I help you today?", className: "incoming" }]);
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([{ role: 'user', text: "Hi there👋! I am PlanIt Assistant. How may I help you today?" }]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to handle sending the message that supports system instructions from our server.js with SDK of Gemini
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;
  
    // Add user input and "Thinking..." message to chat list
    const updatedChatList = [
      ...chatList,
      { message: userMessage, className: "outgoing" },
      { message: "Thinking...", className: "incoming" },
    ];
  
    setChatList(updatedChatList);
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', parts: [{ text: userMessage }] }
    ]);
  
    try {
      const requestBody = {
        history: [
          ...chatHistory.map(entry => ({
            role: entry.role,
            parts: entry.parts
          })),
          { role: 'user', parts: [{ text: userMessage }] } // Add the user's message to history
        ]
      };
  
      console.log('Request body:', JSON.stringify(requestBody));
  
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Remove "Thinking..." message and add assistant's response
      const updatedResponseList = updatedChatList.filter(chat => chat.message !== "Thinking...");
      setChatList([...updatedResponseList, { message: data.response, className: "incoming" }]);
  
      // Update chat history with assistant's response
      setChatHistory(data.history); // Update chat history with assistant's response
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatList([
        ...updatedChatList.filter(chat => chat.message !== "Thinking..."),
        { message: "Oops! Something went wrong. Please try again later.", className: "incoming" }
      ]);
    }
  };
  
  const createChatLi = useCallback((message, className) => {
    return { message, className };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handles when the user sends a message by clicking the button
  const handleChat = () => {
    if (!chatInput.trim()) return; // Prevent sending if no input
    const userMessage = chatInput.trim(); // Capture input message directly
    setChatInput(""); // Clear input
    sendMessage(userMessage); // Pass the message to the sendMessage function
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleChat();
      event.preventDefault();
    }
  };

  const handleRefresh = () => {
    setChatList([{ message: "Hi there! I am PlanIt Assistant. How may I help you today?", className: "incoming" }]);
    setChatHistory([{ role: 'user', text: "Hi there👋! I am PlanIt Assistant. How may I help you today?" }]);
  };

  const handleBack = () => {
    console.log("Back button clicked");
    window.history.back();
  };

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatList]);

  return (
    <div className={`chatbot-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="chatbot">
        <div className="chatbot-header">
          <button className="back-btn" onClick={handleBack} title="Go back">
            <FaArrowLeft />
          </button>
          <div className="header-content">
            <h3>PlanItFamIt</h3>
            <h2>PlanIt Assistant</h2>
          </div>
          <div className="header-buttons">
            <button className="refresh-btn" onClick={handleRefresh} title="Reset conversation">
              <FaSync />
            </button>
            <button className="fullscreen-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>

        <ul className="chatbox" ref={chatContainerRef}>
          {chatList.map((chat, index) => (
            <li key={index} className={`chat-message ${chat.className}`}>
              {chat.className === "outgoing" ? (
                <div className="message-content user-message">
                  <p>{chat.message}</p>
                </div>
              ) : (
                <div className="message-content assistant-message">
                  <span className="bot-icon"><FaRobot /></span>
                  <p>{chat.message}</p>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="chat-input">
          <textarea
            placeholder="Type your message here..."
            spellCheck="false"
            required
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={chatInputRef}
            rows={1}
          />
          <button className="send-btn" onClick={handleChat} disabled={!chatInput.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanItAssistant;
