/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or 'media' if you prefer the media query method
  theme: {
    extend: {
      colors: {
        darkBg: '#1f1f1f',
        darkText: '#e5e7eb',
        lightBg: '#ffffff',
        lightText: '#1f2937',
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

 
  plugins: [],
}