/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 السطر ده مهم جداً عشان التبديل يشتغل
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}