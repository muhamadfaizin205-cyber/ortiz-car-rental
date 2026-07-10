import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "var(--color-primary, #CAA251)",
        dark: "var(--color-dark, #111827)",
        darker: "var(--color-darker, #0B0B0B)",
        light: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Rajdhani", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
