/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          50: "#EEEEFF",
          100: "#E0E0FF",
          200: "#C2C4FF",
          300: "#A4A7FF",
          400: "#8689FF",
          500: "#6366F1",
          600: "#4F51C2",
          700: "#3B3D94",
          800: "#272965",
          900: "#131437",
        },
      },
    },
  },
  plugins: [],
};
