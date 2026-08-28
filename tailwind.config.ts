import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      colors: {
        accent:    "#e8ff3e",
        "bg-base": "#0d0d0d",
        "bg-card": "rgba(255,255,255,0.03)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-up":   "slideUp 0.6s cubic-bezier(0.25, 0.1, 0, 1) forwards",
        grain:        "grain 0.4s steps(1) infinite",
      },
      keyframes: {
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%":      { transform: "translate(-2%,-3%)" },
          "30%":      { transform: "translate(-1%,4%)" },
          "50%":      { transform: "translate(-3%,3%)" },
          "70%":      { transform: "translate(-4%,1%)" },
          "90%":      { transform: "translate(-1%,3%)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
