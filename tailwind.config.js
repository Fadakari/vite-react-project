/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        primary: '#312e81',
        secondary: '#a5b4fc',
        accent: '#fbcfe8',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to bottom, #fdf2f8, #fbcfe8)',
      }
    },
  },
  plugins: [],
}