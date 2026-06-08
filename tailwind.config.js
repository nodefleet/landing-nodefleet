/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Urbanist is the global brand font (rebrand 2026).
        sans: ["Urbanist", "ui-sans-serif", "system-ui", "sans-serif"],
        urbanist: ["Urbanist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand primary — Nodefleet green.
        primary: {
          DEFAULT: "#99DFAF",
          50: "#EAF8EF",
          100: "#D6F1E0",
          200: "#B7E8C8",
          300: "#99DFAF", // brand green
          400: "#6FCB8E",
          500: "#4CB872",
        },
        // Secondary accent — Nodefleet blue (used in gradients green→blue).
        accent: {
          DEFAULT: "#5AA9E6",
          400: "#5AA9E6",
          500: "#3E8FD4",
        },
        // Space / dark surfaces.
        space: {
          DEFAULT: "#12111d", // body background
          deep: "#0A0A14", // deepest sections
          800: "#16151f",
          card: "#1A1922", // card surface base
        },
        // Kept for backward compatibility with pre-rebrand components.
        morado: "rgba(42, 39, 75, 1)",
      },
      boxShadow: {
        // Soft green glow for primary CTAs (matches the mockups).
        glow: "0 0 24px 0 rgba(153, 223, 175, 0.45)",
        "glow-sm": "0 0 14px 0 rgba(153, 223, 175, 0.35)",
      },
      backgroundImage: {
        // Green→blue brand gradient used on accent headings.
        "brand-gradient": "linear-gradient(90deg, #99DFAF 0%, #5AA9E6 100%)",
      },
    },
  },
  plugins: [],
};
