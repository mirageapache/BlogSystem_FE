/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      height: {
        minus120: 'calc(100dvh - 120px)',
        minus240: 'calc(100dvh - 240px)',
      },
      maxHeight: {
        '70vh': '70vh',
        '80vh': '80vh',
      }
    },
  },
  plugins: [],
};
