import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // draft-js 等舊 CommonJS 套件會引用 Node 的全域 `global`，
    // 瀏覽器無此物件。CRA(webpack) 會自動 shim，Vite 不會，
    // 故將 `global` 映射到瀏覽器的 `globalThis`（draft-js 為 Phase 2 移除目標）。
    global: 'globalThis',
  },
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
});
