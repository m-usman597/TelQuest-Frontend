//@ts-nocheck
import React from "react";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./main.css";

function ShowResponse({
  response,
  className,
  message,
}: {
  response: string;
  className?: string;
  message?: any;
}) {
  return (
    <ReactMarkDown
      className={`${"markdown-content"} ${className || ""}`}
      children={response}
      remarkPlugins={[remarkGfm]}
    />
  );
}

export default ShowResponse;
