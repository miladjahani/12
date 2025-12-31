/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-bg': '#1a222c',
        'tg-secondary-bg': '#2a3440',
        'tg-primary': '#3a98d4',
        'tg-text': '#ffffff',
        'tg-secondary-text': '#99a9b9',
      },
      fontFamily: {
        'sans': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}