import ChatBotIcon from "./ChatBot/ChatBotIcon";
import "./ChatBot.css";
import ChatForm from "./ChatBot/ChatForm";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatBot/ChatMessage";
import companyInfo, { getFormattedCompanyInfo } from "./companyInfo"; // Import the function
const initialCompanyInfoString = JSON.stringify(companyInfo, null, 2); // Pretty-print JSON
function ChatBot() {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: getFormattedCompanyInfo(),
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  const generateBotResponse = async (history) => {
    //helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };
    //Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
    try {
      //make the API call to get the bot's response
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyArRhtV2pHMKrkAC-bMUM_akhgiPyIpOB8",
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      //clear and update chat history whit bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error.message, true);
    }
  };
  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <div
      className={`container fixed bottom-6 right-6 z-50 rounded-lg shadow-md ${
        showChatbot ? "show-chatbot" : ""
      }`}
    >
      <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup">
        {/* ChatBot Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Demacia ChatBot</h2>
          </div>
          <button
            className="material-symbols-outlined"
            onClick={() => setShowChatbot((prev) => !prev)}
          >
            keyboard_arrow_down
          </button>
        </div>
        {/* ChatBot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Hey there <br /> How can I help you today?
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* ChatBot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
