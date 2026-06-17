import { test, expect } from '@playwright/test';
import { installApiFallback, mockEndpoint, SAMPLE_POST } from './fixtures/mockApi';

/**
 * 導覽 / 路由 smoke：側欄連結與 404 fallback。
 */
test.describe('導覽與路由', () => {
  test.beforeEach(async ({ page }) => {
    await installApiFallback(page);
    await mockEndpoint(page, '/post/partial', { posts: [SAMPLE_POST], nextPage: 0 });
    await mockEndpoint(page, '/article/partial', { articles: [], nextPage: 0 });
    await mockEndpoint(page, '/utility/searchCount', { article: 0, post: 0, user: 0, hashtag: 0 });
  });

  test('側欄「探索」連結導向 /explore', async ({ page }) => {
    await page.goto('/');

    // 限定在桌面左側欄（SIDEBAR_FRAME 的 lg:w-60），避開 header 內離屏的 #main-menu 同名連結
    const sidebar = page.locator('section.lg\\:w-60');
    await sidebar.getByRole('link', { name: '探索' }).click();

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByRole('button', { name: '文章' })).toBeVisible();
  });

  test('未知路徑顯示 404 頁面', async ({ page }) => {
    await page.goto('/a-path-that-does-not-exist');

    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('你查詢的頁面不存在')).toBeVisible();
  });
});
