// 由 vitest/config 匯入 defineConfig，使 test 區塊可被正確型別化（Phase 3.1）
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 原生解析 tsconfig.json 的 baseUrl:"src" 與 paths（constants/*），
    // 取代 vite-tsconfig-paths plugin（Vite 8 起內建支援）。
    tsconfigPaths: true,
  },
  server: {
    // 沿用 CRA 慣用的 3000 埠（CLAUDE.md 內文件也以 localhost:3000 為準）
    port: 3000,
    open: false,
  },
  build: {
    // Vite 慣例輸出至 dist/（與後續 Docker / Nginx / CI 設定一致）
    outDir: 'dist',
  },
  test: {
    // Phase 3.1：由 jest 平移至 vitest
    globals: true, // 提供全域 describe/test/expect/vi，沿用既有測試免逐檔 import
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false, // 不處理 CSS（等同舊 jest 的 identity-obj-proxy）
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
});
