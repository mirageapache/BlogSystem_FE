// @testing-library/jest-dom 提供 DOM 斷言 matcher（toBeInTheDocument 等），
// v6 起同時支援 vitest 的 expect（本專案 Phase 3.1 已由 jest 平移至 vitest）。
// 由 vite.config.ts 的 test.setupFiles 載入。
import '@testing-library/jest-dom';
