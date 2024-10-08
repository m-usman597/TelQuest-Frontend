import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import { AiFillHome } from "react-icons/ai";

interface StartScreenProps {
  onStartChat: () => void;
  handleMinimizeScreen: () => void;
}
const StartScreen: React.FC<StartScreenProps> = ({
  onStartChat,
  handleMinimizeScreen,
}) => {
  const [localTime, setLocalTime] = useState<string>("");

  // Function to format time based on the user's local timezone
  const formatLocalTime = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",

      hour12: true, // Ensure we get AM/PM format
    };

    // Get user's local time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format time based on user's timezone
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(
      date
    );
  };

  useEffect(() => {
    // Set local time when component loads
    const currentTime = formatLocalTime();
    setLocalTime(currentTime);
  }, []);

  return (
    <>
      <div className="header-container padding-container pt-[10px]">
        <div className="flex justify-end w-full items-center">
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
              className="px-[5px] py-[5px] rounded-[10px] hover:bg-[#efefef73] "
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
        <h2 className="header-title text-[30px] font-bold w-[80%] items-end mt-[60px] family">
          Welcome to TelQuest
        </h2>

        <div className="user-card absolute mt-[15px] left-[46%] transform -translate-x-1/2 bg-white rounded-lg shadow-lg  w-[92%]">
          <div className="flex items-center mb-4">
            <div className="flex items-center ml-[8px]">
              <div className="relative">
                <img
                  src="/assets/bob.png"
                  alt="User Photo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute top-[2px] right-0 left-0 block w-[8px] h-[8px] bg-[#268750] rounded-full ring-2 ring-white"></span>
              </div>
              <div className="ml-[10px] flex flex-col">
                <div className="flex flex-row gap-x-[1px] items-center">
                  <p className="font-normal text-[#6E6E6E] text-[12px]">Bob</p>
                  <span className="mx-[2px]">·</span>
                  <p className="font-normal text-[#6E6E6E] text-[14px]">
                    {localTime}
                  </p>
                </div>
                <p className=" text-sm">Hello. How may I help you?</p>
              </div>
            </div>
          </div>
          <button
            onClick={onStartChat}
            className="w-full bg-[#1A67C3] font-bold text-[14px] text-white py-[10px] rounded-lg shadow hover:bg-[#134D92] transition-all duration-300 ease-in-out flex items-center justify-center gap-x-[8px]"
          >
            Chat now
            <Image
              className="mt-[3px] "
              src={"/assets/chat-send.svg"}
              alt="send"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
      <div className="footer-section absolute bottom-[20px] mr-[20px] left-1/2 transform -translate-x-1/2 flex justify-around items-center w-[90%]  py-[10px]">
        <div className="flex items-center justify-around w-full">
          <div
            className="flex items-center justify-center flex-col cursor-pointer gap-y-[2px]"
            onClick={onStartChat}
          >
            <AiFillHome className="text-[22px] text-[#111111]" />
            <span className="ml-2 text-[12px] family font-normal">Home</span>
          </div>
          <div
            className="flex items-center justify-center flex-col cursor-pointer gap-y-[2px]"
            onClick={onStartChat}
          >
            <Image src={"/assets/chat.svg"} alt="home" width={20} height={20} />
            <span className="ml-2 text-[12px] text-[#787878] font-normal">
              Chat
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartScreen;
