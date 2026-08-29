import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        display: ["var(--font-suez-one)", "var(--font-inter)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        "beacon-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.8)", opacity: "0" },
        },
        "soft-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-shift": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "beacon-pulse": "beacon-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "soft-float": "soft-float 5s ease-in-out infinite",
        "glow-shift": "glow-shift 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
