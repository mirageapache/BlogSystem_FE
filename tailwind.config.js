/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        minus50: 'calc(100dvw - 50px)',
        minus150: 'calc(100dvw - 150px)',
      },
      height: {
        minus120: 'calc(100dvh - 120px)',
        minus180: 'calc(100dvh - 180px)',
        minus240: 'calc(100dvh - 240px)',
      },
      maxHeight: {
        '70vh': '70vh',
        '80vh': '80vh',
      },
    },
  },
  plugins: [],
};
