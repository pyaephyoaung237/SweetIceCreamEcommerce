import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14202B",
        paper: "#F6F7F4",
        cobalt: { DEFAULT: "#2447D6", dark: "#1B37A8", soft: "#E6EBFB" },
        sprint: "#F2C230",
        pine: "#1F7A5A",
      },
      opacity: {
        0: "0", 5: "0.05", 10: "0.1", 15: "0.15", 20: "0.2", 25: "0.25", 30: "0.3", 35: "0.35",
        40: "0.4", 45: "0.45", 50: "0.5", 55: "0.55", 60: "0.6", 65: "0.65", 70: "0.7",
        75: "0.75", 80: "0.8", 85: "0.85", 90: "0.9", 95: "0.95", 100: "1",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
