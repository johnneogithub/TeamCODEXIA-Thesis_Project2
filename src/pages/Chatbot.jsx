import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../pages/ChatbotStyle.css';
import { FaRobot, FaSync } from "react-icons/fa";
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
    <div className="chatbot">
      <div className='chatbothead'>
        <h3>PlanItFamIt</h3>
        <h2>PlanIt Assistant</h2>
        <div className='refresh'  onClick={handleRefresh}>
          <FaSync /> 
        </div>
      </div>
    
      <ul className="chatbox" ref={chatContainerRef}>
      {chatList.map((chat, index) => (
        <li key={index} className={`chat ${chat.className}`}>
          {chat.className === "outgoing" ? <p>{chat.message}</p> : <><span><FaRobot /></span><p>{chat.message}</p></>}
        </li>
      ))}
      </ul>

      <div className="chat-input">
        <textarea placeholder="Enter a message..." spellCheck="false" required value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={handleKeyPress} ref={chatInputRef} />
        <span id="send-btn" className="material-symbols-rounded" onClick={handleChat}>send</span>
      </div>
    </div>
  );
}

export default Chatbot;