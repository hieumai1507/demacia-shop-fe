import ChatBotIcon from "./ChatBot/ChatBotIcon";
import "./ChatBot.css";
import ChatForm from "./ChatBot/ChatForm";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatBot/ChatMessage";
import { getFormattedCompanyInfo } from "./companyInfo";

function ChatBot() {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "user",
      text: getFormattedCompanyInfo(),
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.isPlaceholder !== true),
        { role: "model", text, isError },
      ]);
    };
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: history,
        systemInstruction: {
          role: "user",
          parts: [
            {
              text:
                "You are a concise, helpful shopping assistant for Demacia Shop. Use the provided company context. If the question is unrelated, politely steer back to shopping or store info.",
            },
          ],
        },
      }),
    };
    try {
      if (!apiKey)
        throw new Error("Missing API key. Set VITE_GEMINI_API_KEY in your environment.");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Something went wrong!");
      const apiResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\*\*(.*?)\*\*/g, "$1")
          ?.trim();
      if (apiResponseText) {
        updateHistory(apiResponseText);
      } else {
        updateHistory("Sorry, I couldn't generate a response. Please try again.", true);
      }
    } catch (error) {
      updateHistory(`Error: ${error.message}`, true);
    }
  };
  useEffect(() => {
    if (!chatBodyRef.current) return;
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