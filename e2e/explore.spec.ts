import { test, expect } from '@playwright/test';
import { installApiFallback, mockEndpoint, SAMPLE_POST } from './fixtures/mockApi';

/**
 * 探索頁 smoke：頁籤呈現與切換（journey #1：Explore 切換 tag）。
 * 預設頁籤為 article（見 sysSlice 初始 exploreTag），切到「貼文」會掛載 ExplorePost 並抓 /post/partial。
 */
test.describe('探索頁', () => {
  test.beforeEach(async ({ page }) => {
    await installApiFallback(page);
    // article 分頁：空結果（安全渲染，不需要 ArticleItem 完整資料）
    await mockEndpoint(page, '/article/partial', { articles: [], nextPage: 0 });
    // post 分頁：一筆貼文，供切到「貼文」後驗證
    await mockEndpoint(page, '/post/partial', { posts: [SAMPLE_POST], nextPage: 0 });
    // 數量徽章查詢（無搜尋字串時也會打）
    await mockEndpoint(page, '/utility/searchCount', { article: 0, post: 1, user: 0, hashtag: 0 });
    // 搜尋字串改變時，分頁會改打 search 端點 — 一併 mock 避免列表元件取不到陣列而 throw
    await mockEndpoint(page, '/article/search', { articles: [], nextPage: 0 });
    await mockEndpoint(page, '/post/search', { posts: [], nextPage: 0 });
  });

  test('顯示四個分頁與搜尋框', async ({ page }) => {
    await page.goto('/explore');

    await expect(page.getByRole('button', { name: '文章' })).toBeVisible();
    await expect(page.getByRole('button', { name: '貼文' })).toBeVisible();
    await expect(page.getByRole('button', { name: '用戶' })).toBeVisible();
    await expect(page.getByRole('button', { name: '標籤' })).toBeVisible();
    await expect(page.getByPlaceholder('搜尋...')).toBeVisible();
  });

  test('切換到「貼文」分頁後載入貼文內容', async ({ page }) => {
    await page.goto('/explore');

    await page.getByRole('button', { name: '貼文' }).click();

    await expect(page.getByText('這是一則 E2E 測試貼文內容')).toBeVisible();
  });

  test('在搜尋框輸入會反映到網址查詢參數', async ({ page }) => {
    await page.goto('/explore');

    await page.getByPlaceholder('搜尋...').fill('react');

    await expect(page).toHaveURL(/[?&]search=react/);
  });
});
