"use client";

import React, { useState, useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi"; // Import Sun and Moon icons for theme toggle
import { Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import ThreeDotsLoader from "../MicroComponents/Loader";
import { v4 as uuidv4 } from "uuid";
import ShowResponse from "../MicroComponents/Response";
import { sanitizeResponse } from "../../utils/regex";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

const ChatBotMain = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: sanitizeResponse(
        "Hello, I’m Bob and I can help you with anything…."
      ),
      sender: "bot",
    },
  ]);
  const [text, setText] = useState("");
  const [headerShow, setHeaderShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Theme state

  const sessionIdRef = useRef<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("session_id", sessionId);
    }
    sessionIdRef.current = sessionId;
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async () => {
    if (text.trim()) {
      setHeaderShow(true);
      setIsLoading(true);

      const userMessage: Message = {
        id: Date.now(),
        text: text.trim(),
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "47px";
      }

      const tempBotMessage: Message = {
        id: Date.now() + 1,
        text: "",
        sender: "bot",
        isLoading: true,
      };
      setMessages((prevMessages) => [...prevMessages, tempBotMessage]);

      try {
        const response = await axios.post(`${apiUrl}ask`, {
          session_id: sessionIdRef.current,
          user_input: userMessage.text,
        });

        const data = response.data;
        console.log("🚀 ~ handleSend ~ data:", data);

        let botResponse: Message;
        if (data && data.response && data.response.length > 0) {
          // Extract the 'value' field from each response object
          const values = data.response
            .filter((item: any) => item.text && item.text.value)
            .map((item: any) => item.text.value);

          // Combine all the values into a single string (if there are multiple)
          const combinedValue = values.join(" ");

          botResponse = {
            id: tempBotMessage.id,
            text: combinedValue,
            sender: "bot",
          };
        } else {
          botResponse = {
            id: tempBotMessage.id,
            text: "I'm sorry, I couldn't process that. Please try again.",
            sender: "bot",
          };
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempBotMessage.id ? botResponse : msg
          )
        );
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error response
        const errorMessage: Message = {
          id: tempBotMessage.id,
          text: "There was an error sending your message. Please try again later.",
          sender: "bot",
        };
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempBotMessage.id ? errorMessage : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShowHeader = () => {
    setHeaderShow(false);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  console.log("text", messages);
  return (
    <div className="flex justify-center items-center  min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="flex flex-col w-full   container mx-auto max-w-5xl h-[80vh] bg-white  border-[1px] border-[#efefef69]  dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
        <div className="flex flex-col w-full h-full">
          <div className="bg-white dark:bg-gray-800 pl-4 pr-4 pt-4">
            <div className="flex justify-between items-center w-full pb-2.5">
              <AnimatePresence>
                <motion.div
                  key="headerShow"
                  className="flex justify-center items-center h-full gap-x-2 cursor-pointer  rounded-lg py-2"
                  onClick={handleShowHeader}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative flex items-center">
                    <img
                      src="/assets/bob.png"
                      alt="Bot Photo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="absolute top-0 right-0 block w-2 h-2 bg-[#268750] rounded-full ring-2 ring-white"></span>
                  </div>
                  <p className="text-[16px] font-bold text-center text-gray-800 dark:text-gray-200">
                    Bob
                  </p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                  <FiSun className="text-yellow-400" />
                ) : (
                  <FiMoon className="text-gray-800" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`flex flex-col p-4 space-y-4 scrollbar-custom flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-700`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== "user" && (
                  <img
                    src="/assets/bob.png"
                    alt="Bot Photo"
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`chat-message-desktop rounded-lg flex flex-col p-4 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {/* {message.sender === "bot" && message.isLoading ? (
                      <ThreeDotsLoader />
                    ) : (
                      <ShowResponse
                        response={sanitizeResponse(message.text)}
                        className={`  ${
                          message.sender === "user"
                            ? "text-white"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      />
                    )} */}
                    {message.sender === "bot" && message.isLoading ? (
                      <ThreeDotsLoader />
                    ) : message.sender === "bot" ? (
                      <ShowResponse
                        response={sanitizeResponse(message.text)}
                        className="markdown-content dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-base text-white">{message.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800">
            <div
              className={`flex items-center bg-white dark:bg-gray-700 rounded-lg transition-colors duration-200 ${
                text.trim()
                  ? "border border-blue-500"
                  : "border border-gray-300 dark:border-gray-600"
              } focus-within:border-blue-500`}
            >
              <textarea
                disabled={isLoading ? true : false}
                ref={textareaRef}
                className="flex-grow resize-none w-full px-4 py-2.5 overflow-y-auto rounded-lg outline-none bg-transparent text-gray-800 dark:text-gray-100"
                placeholder="Type your message..."
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{
                  maxHeight: "90px",
                  lineHeight: "24px",
                }}
              />
              <div className="flex items-end justify-end h-full ml-2.5">
                {isLoading ? (
                  <button
                    className={`py-2 px-2 rounded-lg flex items-center justify-center transition-colors duration-200 mr-2.5 bg-blue-500 hover:bg-blue-600 text-white cursor-not-allowed`}
                    aria-label="Send Message"
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className={`py-2 px-2 rounded-lg flex items-center justify-center transition-colors duration-200 mr-2.5 ${
                      text.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label="Send Message"
                  >
                    <MdSend className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotMain;
