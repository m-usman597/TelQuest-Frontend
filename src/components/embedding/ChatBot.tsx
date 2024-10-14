"use client";
import React, { useState } from "react";
import StartScreen from "./StartScreen";
import ChatScreen from "./ChatScreen";
import { FaRegMessage, FaMessage } from "react-icons/fa6";
import { motion } from "framer-motion";
import { sanitizeResponse } from "../../utils/regex";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

const EmbeddingChatBot = () => {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [show, setShow] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: sanitizeResponse(
        "Hello, I’m Bob and I can help you with anything…."
      ),
      sender: "bot",
    },
  ]);

  const handleStartChat = () => {
    setScreen(2);
  };

  const handleBackToStart = () => {
    setScreen(1);
  };

  const handleChatNowClick = () => {
    setShow(!show);
    setScreen(1);
    setHover(false);
  };

  return (
    <div
      className={`flex flex-col justify-end items-end h-screen bg-gray-100 ${
        show ? "pr-6 pb-4" : "pb-[5px] pr-[20px]"
      }`}
      style={{ overflowY: show ? "hidden" : "auto" }}
    >
      {show && (
        <motion.div
          className="bg-main-container rounded-lg shadow-lg w-full max-w-[380px] h-[690px] relative overflow-hidden"
          initial={{ opacity: 0, y: 100, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
        >
          {screen === 1 && (
            <StartScreen
              onStartChat={handleStartChat}
              handleMinimizeScreen={handleChatNowClick}
            />
          )}
          {screen === 2 && (
            <ChatScreen
              messages={messages}
              setMessages={setMessages}
              onBack={handleBackToStart}
              handleMinimizeScreen={handleChatNowClick}
            />
          )}
        </motion.div>
      )}
      {!show && (
        <div
          onClick={handleChatNowClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="bg-[#1A67C3] px-[20px] py-[10px] cursor-pointer rounded-tr-[14px] rounded-tl-[14px] text-base font-medium flex justify-between items-center w-[276px] h-[60px]"
        >
          <span className="text-[16px] font-bold family text-white">
            Chat Now
          </span>
          {hover ? (
            <div className="relative">
              <FaMessage className="text-white font-semibold text-[25px] relative" />
              {/* Render dots on hover inside the icon */}
              <span className="dots absolute top-2 right-2 flex space-x-1">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </div>
          ) : (
            <FaRegMessage className="text-white font-semibold rounded-sm text-[25px]" />
          )}
        </div>
      )}
    </div>
  );
};

export default EmbeddingChatBot;
