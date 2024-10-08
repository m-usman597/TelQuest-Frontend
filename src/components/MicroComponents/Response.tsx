//@ts-nocheck
import React from "react";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (lists, tables, etc.)
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // For optional code blocks
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Theme for syntax highlighting

// Intelligent ShowResponse Component for E-commerce Info
function ShowResponse({
  response,
  className,
}: {
  response: string;
  className?: string;
}) {
  // Custom renderers for handling different markdown components
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus} // Choose a theme for syntax highlighting (if needed)
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Custom renderer for images to handle product images
    img({ src, alt }: { src: string; alt: string }) {
      return (
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: "100%", height: "auto", margin: "10px 0" }}
        />
      );
    },
    // Custom renderer for links to style product URLs
    a({ href, children }: { href: string; children: React.ReactNode }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007BFF", textDecoration: "underline" }}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <ReactMarkDown
      className={className}
      remarkPlugins={[remarkGfm]} // Add GitHub Flavored Markdown plugin for lists and tables
      components={renderers} // Pass custom renderers for images, links, and more
    >
      {response}
    </ReactMarkDown>
  );
}

export default ShowResponse;
