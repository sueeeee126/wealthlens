import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F2F2F7",
        card: "#FFFFFF",
        "primary-text": "#1C1C1E",
        "secondary-text": "#8E8E93",
        border: "#E5E5EA",
        green: "#34C759",
        red: "#FF3B30",
        orange: "#FF9500",
        purple: "#AF52DE",
        blue: "#007AFF",
        "dark-card": "#2C2C2E",
        "dark-bg": "#1C1C1E",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Display",
          "PingFang SC",
          "Noto Sans SC",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "22px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        "card-md": "0 4px 12px rgba(0,0,0,0.08)",
      },
      maxWidth: {
        mobile: "390px",
      },
    },
  },
  plugins: [],
};
export default config;
