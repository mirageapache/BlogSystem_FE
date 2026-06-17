// msw 預設 handlers（共用基底）。
// 個別測試以 server.use(...) 疊加情境化 handler；此處保留空陣列即可，
// 搭配 setupTests 的 onUnhandledRequest: 'error' 強制每個請求都要有對應 handler。
import type { RequestHandler } from 'msw';

export const handlers: RequestHandler[] = [];
