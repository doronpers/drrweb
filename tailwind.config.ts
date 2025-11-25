import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["EB Garamond", "Georgia", "Times New Roman", "serif"],
        mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
      },
      colors: {
        architect: {
          bg: "#FAFAFA",
          text: "#000000",
          accent: "#FF0000",
        },
        author: {
          bg: "#FFF9F0",
          text: "#1A1A1A",
          accent: "#8B4513",
        },
        lab: {
          bg: "#0A0A0A",
          text: "#00FF00",
          accent: "#FF00FF",
        },
      },
      backgroundImage: {
        grain: "url('/textures/grain.png')",
      },
    },
  },
  plugins: [],
};

export default config;
