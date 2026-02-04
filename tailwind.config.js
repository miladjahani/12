/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          bg: '#17212b',
          sidebar: '#0e1621',
          bubble: '#2b5278',
          accent: '#40a7e3',
          text: '#ffffff',
          'text-muted': '#8b9bb4',
        }
      }
    },
  },
  plugins: [],
}
