import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 設定（Phase 3.2 smoke set）
 *
 * 策略：所有 API 以 page.route 在前端攔截 mock（見 e2e/fixtures/mockApi.ts），
 * 因此不需要後端 / test DB 也能在 CI 完整跑完，且結果 deterministic。
 * 真實整合測試（打 staging API 的 full journey）列為後續批次。
 *
 * 對應 UPGRADE_PLAN 3.2：smoke set 對著 Vite dev server 跑。
 *
 * 埠號用專屬的 4399（而非開發慣用的 3000），因為 3000/5173 等常被 Docker、
 * 其他本機專案佔用；--strictPort 讓埠被佔時直接失敗、不自動跳號，確保 url 可預期。
 */
const E2E_PORT = 4399;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // CI 上若殘留 test.only 直接失敗
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'retain-on-failure', // 每個 test 都錄，通過即丟棄、只保留失敗的 trace 供除錯
    screenshot: 'only-on-failure',
  },
  projects: [
    // smoke set 只跑 chromium 以維持「每 PR < 3 分鐘」；full set（多瀏覽器）屬後續批次
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // 自動啟動 Vite dev server；本機已開著就沿用，CI 則自行啟動
  webServer: {
    command: `npm run dev -- --port ${E2E_PORT} --strictPort`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
