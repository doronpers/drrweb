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
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-eb-garamond)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "monospace"],
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
          accent: "#00FFFF",
        },
      },
      backgroundImage: {
        grain: "url('/textures/grain.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
