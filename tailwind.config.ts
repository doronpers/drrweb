import type { Config } from "tailwindcss";

/**
 * ====================================
 * DESIGN TOKEN SYSTEM
 * ====================================
 * 
 * Following Dieter Rams principles:
 * - Systematic spacing scale (8px base unit)
 * - Refined color harmony with muted accents
 * - Timeless typography tokens
 * - Consistent visual hierarchy
 */

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ====================================
      // TYPOGRAPHY
      // ====================================
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-eb-garamond)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "monospace"],
      },
      
      // Typography scale with consistent ratios (Major Third: 1.25)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],    // 14px
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],            // 16px
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],           // 18px
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],      // 20px
        '2xl': ['1.563rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],   // 25px
        '3xl': ['1.953rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],   // 31px
        '4xl': ['2.441rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],   // 39px
        '5xl': ['3.052rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],   // 49px
        '6xl': ['3.815rem', { lineHeight: '1', letterSpacing: '-0.05em' }],     // 61px
      },

      // ====================================
      // SPACING SCALE (8px base unit)
      // ====================================
      spacing: {
        '0.5': '0.125rem',   // 2px
        '1': '0.25rem',       // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',        // 8px
        '2.5': '0.625rem',    // 10px
        '3': '0.75rem',       // 12px
        '3.5': '0.875rem',    // 14px
        '4': '1rem',          // 16px
        '5': '1.25rem',       // 20px
        '6': '1.5rem',        // 24px
        '7': '1.75rem',       // 28px
        '8': '2rem',          // 32px
        '9': '2.25rem',       // 36px
        '10': '2.5rem',       // 40px
        '12': '3rem',         // 48px
        '14': '3.5rem',       // 56px
        '16': '4rem',         // 64px
        '20': '5rem',         // 80px
        '24': '6rem',         // 96px
        '32': '8rem',         // 128px
      },

      // ====================================
      // COLOR SYSTEM (Refined & Muted)
      // ====================================
      colors: {
        // Architect mode - Swiss precision, muted red accent
        architect: {
          bg: "#FAFAFA",
          text: "#000000",
          accent: "#CC0000", // Muted from #FF0000 (20% less saturation)
          'accent-light': "#E60000",
          'accent-dark': "#990000",
          border: "rgba(0, 0, 0, 0.1)",
          'border-hover': "rgba(0, 0, 0, 0.2)",
        },
        // Author mode - Editorial warmth, muted brown accent
        author: {
          bg: "#FFF9F0",
          text: "#1A1A1A",
          accent: "#6B3410", // Muted from #8B4513 (more refined)
          'accent-light': "#8B5A2B",
          'accent-dark': "#4A2A0A",
          border: "rgba(26, 26, 26, 0.15)",
          'border-hover': "rgba(26, 26, 26, 0.25)",
        },
        // Lab mode - Terminal aesthetic, muted green/magenta
        lab: {
          bg: "#0A0A0A",
          text: "#00CC00", // Muted from #00FF00
          accent: "#CC00CC", // Muted from #FF00FF
          'accent-light': "#E600E6",
          'accent-dark': "#990099",
          border: "rgba(0, 204, 0, 0.2)",
          'border-hover': "rgba(0, 204, 0, 0.4)",
        },
        // Neutral grays for consistent use
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },

      // ====================================
      // BORDER RADIUS
      // ====================================
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        'full': '9999px',
      },

      // ====================================
      // SHADOWS (Subtle, purposeful)
      // ====================================
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'focus': '0 0 0 3px rgba(0, 0, 0, 0.1)',
      },

      // ====================================
      // TRANSITIONS
      // ====================================
      transitionDuration: {
        'DEFAULT': '200ms',
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '800ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        'ease-out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },

      backgroundImage: {
        grain: "url('/textures/grain.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
