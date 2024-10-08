"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdArrowBack, MdSend } from "react-icons/md";
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

interface ChatScreenProps {
  onBack: () => void;
  handleMinimizeScreen: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  onBack,
  handleMinimizeScreen,
  messages,
  setMessages,
}) => {
  const [text, setText] = useState("");
  const [headerShow, setHeaderShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sessionIdRef = useRef<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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

  const handleTextChange = (e: any) => {
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
        textareaRef.current.style.height = "47px"; // Reset the textarea height
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

        let botResponse: Message;
        if (data && data.response) {
          botResponse = {
            id: tempBotMessage.id,
            text: data.response,
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

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShowHeader = () => {
    setHeaderShow(false);
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      <div className="bg-white second-header pl-[10px] pr-[10px] pt-[10px]">
        <div className="flex justify-between items-center w-full pb-[10px]">
          <div className="flex gap-x-[10px] items-center">
            <div className="flex hover:bg-[#efefef73] px-[5px] py-[5px] rounded-[10px]">
              <MdArrowBack
                className="h-[25px] w-[25px] cursor-pointer"
                onClick={onBack}
              />
            </div>
            {/* <div className="flex hover:bg-[#efefef73] px-[5px] py-[5px] rounded-[10px]">
              <PiDotsThreeOutlineFill className="h-[25px] w-[25px] cursor-pointer" />
            </div> */}
          </div>

          <AnimatePresence>
            {headerShow && (
              <motion.div
                key="headerShow"
                className="flex justify-center items-center h-full gap-x-[5px] cursor-pointer hover:bg-[#efefefb0]  rounded-[10px] py-[7px] px-[10px]"
                onClick={handleShowHeader}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <img
                    src="/assets/bob.png"
                    alt="Bot Photo"
                    className="w-[30px] h-[30px] rounded-full object-cover"
                  />
                  <span className="absolute top-[0px] right-0 left-0 block w-[8px] h-[8px] bg-[#268750] rounded-full ring-2 ring-white"></span>
                </div>
                <p className="text-[14px] font-bold text-center">Bob</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end items-center gap-x-2">
            <Tooltip
              title={
                <span className="text-[12px] px-[5x] py-[2px]">
                  Minimize window
                </span>
              }
              placement="bottomLeft"
              arrow={false}
            >
              <div
                className="px-[5px] py-[5px] rounded-[10px] hover:bg-[#efefef73]"
                onClick={handleMinimizeScreen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[24px] h-[24px] cursor-pointer rounded"
                >
                  <path d="M5 11h14v2H5z" />
                </svg>
              </div>
            </Tooltip>
          </div>
        </div>

        <AnimatePresence>
          {!headerShow && (
            <motion.div
              key="headerHide"
              className="flex flex-col items-center mt-2 pb-[20px] mb-[10px]"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.1 }}
            >
              <div className="relative">
                <img
                  src="/assets/bob.png"
                  alt="Bot Photo"
                  className="w-[56px] h-[56px] rounded-full object-cover"
                />
                <span className="absolute top-[8px] right-0 left-0 block w-[8px] h-[8px] bg-[#268750] rounded-full ring-2 ring-white"></span>
              </div>
              <p className="text-[16px] font-bold mt-2">Bob</p>
              <p className="text-[14px] text-gray-600">Account Executive</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={`flex flex-col p-4 space-y-4 mt-4 ${
          headerShow ? "h-[calc(100%_-150px)]" : "h-[calc(100%_-280px)]"
        } overflow-y-auto`}
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
                className="w-[30px] h-[30px] rounded-full mr-2 object-cover"
              />
            )}
            <div className="flex flex-col">
              <div
                className={`chat-message rounded-lg flex flex-col p-2 ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-[#FFF]"
                }`}
              >
                {message.sender === "bot" && message.isLoading ? (
                  <ThreeDotsLoader />
                ) : (
                  <ShowResponse
                    response={sanitizeResponse(message.text)}
                    className={`!whitespace-pre-wrap !break-words ${
                      message.sender === "user" ? "text-white" : "text-black"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div
          className={`flex items-center bg-white rounded-[14px] transition-colors duration-200 ${
            text.trim() ? "border border-blue-500" : "border border-gray-300"
          } focus-within:border-blue-500`}
        >
          <textarea
            ref={textareaRef}
            className="flex-grow resize-none w-full px-4 py-[10px] overflow-y-auto rounded-[18px] outline-none custom-textarea"
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
          <div className="flex items-end justify-end h-full ml-2">
            {isLoading ? (
              <button
                className={`py-[8px] px-[8px] rounded-[12px] flex ${
                  text.trim().length == 100
                    ? "items-end justify-end"
                    : "items-center justify-center"
                }    transition-colors duration-200 mr-[10px] bg-blue-500 hover:bg-blue-600 text-white cursor-not-allowed`}
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
                className={`py-[8px] px-[8px] rounded-[12px] flex items-center justify-center transition-colors duration-200 mr-[10px] ${
                  text.trim()
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                aria-label="Send Message"
              >
                <MdSend className="w-[20px] h-[20px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatScreen;
