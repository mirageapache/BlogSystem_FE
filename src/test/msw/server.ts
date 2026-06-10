// msw node 端攔截伺服器（Phase 3.1 Batch B 導入）。
// 用來在 api 層測試攔截真實 axios 請求，較 vi.mock 整個 api 模組更貼近實際行為。
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
