import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ffffff", // Light theme background
          dark: "#1f2937", // Dark theme background
        },
        secondary: {
          light: "#f9fafb", // Light theme message background
          dark: "#374151", // Dark theme message background
        },
        accent: {
          light: "#3b82f6", // Light theme accent color
          dark: "#2563eb", // Dark theme accent color
        },

        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        custom:
          "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
      },
    },
  },
  plugins: [],
};
export default config;
