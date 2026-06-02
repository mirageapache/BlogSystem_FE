// CRA 內建的 PostCSS 流程改由 Vite 接手，需顯式宣告 Tailwind 與 autoprefixer。
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
