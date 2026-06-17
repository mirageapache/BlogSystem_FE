/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 品牌字樣（ReactBlog wordmark 專用）：Akaya Kanadaka 為單一字重的裝飾性 display 字體，
        // 僅用於 logo，其餘標題仍用 serif；拉丁字後退至 Libre Bodoni，中文後退至系統字型。
        brand: ['Akaya Kanadaka', 'Libre Bodoni', 'PingFang TC', 'Microsoft JhengHei', 'serif'],
        // 標題：襯線（拉丁字以 Libre Bodoni，中文 fallback 至系統無襯線，保持清晰）
        serif: [
          'Libre Bodoni',
          'PingFang TC',
          'Microsoft JhengHei',
          'Noto Serif TC',
          'serif',
        ],
        // 內文／介面：Public Sans，中文 fallback 至系統字型
        sans: [
          'Public Sans',
          'PingFang TC',
          'Microsoft JhengHei',
          'Noto Sans TC',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'Source Code Pro',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      // 語意化色彩 token，由 CSS 變數驅動，深色模式自動切換（見 index.css）
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          2: 'rgb(var(--c-surface-2) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
        },
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: {
          DEFAULT: 'rgb(var(--c-line) / <alpha-value>)',
          strong: 'rgb(var(--c-line-strong) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          strong: 'rgb(var(--c-brand-strong) / <alpha-value>)',
          soft: 'rgb(var(--c-brand-soft) / <alpha-value>)',
        },
      },
      borderRadius: {
        card: '0.875rem', // 14px：卡片統一圓角
      },
      boxShadow: {
        // 暖色調分層柔和陰影
        card: '0 1px 2px rgb(28 25 23 / 0.04), 0 4px 12px -2px rgb(28 25 23 / 0.06)',
        'card-hover':
          '0 2px 4px rgb(28 25 23 / 0.05), 0 12px 28px -4px rgb(28 25 23 / 0.12)',
        pop: '0 8px 30px -4px rgb(28 25 23 / 0.18)',
      },
      width: {
        minus50: 'calc(100dvw - 50px)',
        minus150: 'calc(100dvw - 150px)',
      },
      height: {
        minus120: 'calc(100dvh - 120px)',
        minus180: 'calc(100dvh - 180px)',
        minus240: 'calc(100dvh - 240px)',
        minus280: 'calc(100dvh - 280px)',
        minus325: 'calc(100dvh - 325px)',
      },
      maxHeight: {
        '70vh': '70vh',
        '80vh': '80vh',
      },
    },
  },
  plugins: [],
};
