import { test, expect } from '@playwright/test';
import { installApiFallback, mockEndpoint, SAMPLE_POST } from './fixtures/mockApi';

/**
 * 首頁 smoke：訪客未登入即可瀏覽動態貼文列表（journey #1 的一部分）。
 */
test.describe('首頁', () => {
  test.beforeEach(async ({ page }) => {
    await installApiFallback(page);
    // 首頁動態：POST /post/partial → 一筆貼文且無下一頁（nextPage 0）
    await mockEndpoint(page, '/post/partial', { posts: [SAMPLE_POST], nextPage: 0 });
  });

  test('載入後顯示貼文內容與作者，並出現到底提示', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('這是一則 E2E 測試貼文內容')).toBeVisible();
    await expect(page.getByText('測試作者')).toBeVisible();
    // atBottom（nextPage 0 → hasNextPage false）時顯示的列表結尾提示
    await expect(page.getByText('- 已經沒有更多貼文了 -')).toBeVisible();
  });

  test('未登入時 header 顯示登入/註冊入口', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: '登入' })).toBeVisible();
    await expect(page.getByRole('button', { name: '註冊' })).toBeVisible();
  });
});
