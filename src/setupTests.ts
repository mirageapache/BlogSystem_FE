// @testing-library/jest-dom 提供 DOM 斷言 matcher（toBeInTheDocument 等），
// v6 起同時支援 vitest 的 expect（本專案 Phase 3.1 已由 jest 平移至 vitest）。
// 由 vite.config.ts 的 test.setupFiles 載入。
import '@testing-library/jest-dom';
import { server } from './test/msw/server';

// msw：整個測試生命週期啟動攔截伺服器。
// onUnhandledRequest: 'error' → 未被 handler 覆蓋的請求視為錯誤，避免測試誤打真實後端。
// 純函式 / 已 mock api 模組的測試不會發出請求，不受影響。
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
