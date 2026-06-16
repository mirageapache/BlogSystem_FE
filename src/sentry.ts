import * as Sentry from '@sentry/react';

/**
 * 初始化 Sentry 錯誤監控
 * 只有在環境變數有設定 VITE_SENTRY_DSN 時才會啟用
 * 本機開發 (無 DSN) 會直接 return，不送任何資料。
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // 無 DSN (本機/未設定) -> 不啟用

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'production', 'development'
    integrations: [
      Sentry.browserTracingIntegration(), // 效能追蹤 (頁面載入、路由切換)
      Sentry.replayIntegration(), // Session Replay (重現使用者操作)
    ],
    // 效能追蹤抽樣率：正式環境 10% (流量大可再調低省額度)
    tracesSampleRate: 0.1,
    // Session Replay：一般 session 抽 5%；發生錯誤的 session 100% 全錄
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
  });
}
