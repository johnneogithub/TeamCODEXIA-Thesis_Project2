import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../pages/ChatbotStyle.css';
import { FaRobot, FaSync, FaPaperPlane, FaUser, FaCompress, FaExpand, FaArrowLeft } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDwe06kQZT32Y1w6sbxIWsBDMUeHlosIpc"; // Add your Google API key here
const MODEL_NAME = "gemini-1.5-pro-latest";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const chat = model.startChat({
  history: [],
});

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatList, setChatList] = useState([{ message: "Hi there! I am PlanIt Assistant how may I help you today?", className: "incoming"}]);
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: "Hi there👋! I am PlanIt Assistant how may I help you today?" }]);
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sendMessage = async () => {
    setIsThinking(true); // Set isThinking to true when a message is sent
    setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'assistant', text: "Thinking..." }]);
    const result = await chat.sendMessage(message);
    const response = result.response;
    setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'assistant', text: response.text() }]);
    setMessage('');
    setIsThinking(false); // Set isThinking to false when a response is received
  };

  const createChatLi = useCallback((message, className) => {
    return { message, className };
  }, []);

  const generateResponse = useCallback(async () => {
    setIsThinking(true);
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const incomingChat = createChatLi(response.text(), "incoming");
    setChatList(prevChatList => [...prevChatList, incomingChat]);
    setIsThinking(false);
  }, [userMessage, createChatLi]);
  
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

  const handleChat = () => {
    if(!chatInput.trim() || isThinking) return; // Prevent sending a message if the assistant is currently thinking
    const outgoingChat = createChatLi(chatInput.trim(), "outgoing");
    setChatList(prevChatList => [...prevChatList, outgoingChat]);
    setUserMessage(chatInput.trim());
    setChatInput("");
    sendMessage(); // Call sendMessage here after setting the user message
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      handleChat();
      event.preventDefault();
    }
  }

  const handleRefresh = () => {
    setChatList([{ message: "Hi there! I am PlanIt Assistant how may I help you today?", className: "incoming"}]);
  }

  const handleBack = () => {
    console.log("Back button clicked");

    window.history.back();
  };

  useEffect(() => {
    if(userMessage) {
      const incomingChat = createChatLi("Thinking...", "incoming");
      setChatList(prevChatList => [...prevChatList, incomingChat]);
      generateResponse(incomingChat);
    }
  }, [userMessage, createChatLi, generateResponse]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatList]);

  return (
    <div className="chatbot-container fullscreen">
      <div className="chatbot">
        <div className='chatbot-header'>
          <button className='back-btn' onClick={handleBack} title="Go back">
            <FaArrowLeft />
          </button>
          <div className="header-content">
            <h3>PlanItFamIt</h3>
            <h2>PlanIt Assistant</h2>
          </div>
          <div className="header-buttons">
            <button className='refresh-btn' onClick={handleRefresh} title="Reset conversation">
              <FaSync /> 
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
          {isThinking && (
            <li className="chat-message incoming">
              <div className="message-content assistant-message">
                <span className="bot-icon"><FaRobot /></span>
                <p className="thinking">Thinking<span>.</span><span>.</span><span>.</span></p>
              </div>
            </li>
          )}
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
            disabled={isThinking}
            rows={1}
          />
          <button className="send-btn" onClick={handleChat} disabled={isThinking || !chatInput.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;