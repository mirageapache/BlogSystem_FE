import { test, expect } from '@playwright/test';
import { installApiFallback, mockEndpoint, SAMPLE_POST, SAMPLE_USER } from './fixtures/mockApi';

/**
 * 登入 / 註冊 popup smoke（journey #2 的登入段、#3 的訪客登入段）。
 */
test.describe('登入 / 註冊', () => {
  test.beforeEach(async ({ page }) => {
    await installApiFallback(page);
    await mockEndpoint(page, '/post/partial', { posts: [SAMPLE_POST], nextPage: 0 });
    await page.goto('/');
  });

  test('點擊 header「登入」開啟登入 popup', async ({ page }) => {
    await page.getByRole('button', { name: '登入' }).click();

    await expect(page.getByRole('heading', { name: '歡迎回來' })).toBeVisible();
    await expect(page.getByPlaceholder('E-mail')).toBeVisible();
    await expect(page.getByPlaceholder('password')).toBeVisible();
  });

  test('空白送出觸發欄位驗證訊息', async ({ page }) => {
    await page.getByRole('button', { name: '登入' }).click();
    await page.locator('form button[type="submit"]').click();

    await expect(page.getByText('Email為必填欄位')).toBeVisible();
  });

  test('輸入正確帳密 + 後端回 200 → popup 關閉並切換為已登入', async ({ page }) => {
    await mockEndpoint(page, '/auth/signin', SAMPLE_USER, 200);

    await page.getByRole('button', { name: '登入' }).click();
    await page.getByPlaceholder('E-mail').fill('user@example.com');
    await page.getByPlaceholder('password').fill('password123');
    await page.locator('form button[type="submit"]').click();

    // 成功提示（SweetAlert2）出現，隨後 popup 關閉、header 不再有「登入」入口
    await expect(page.getByText('登入成功')).toBeVisible();
    await expect(page.getByRole('heading', { name: '歡迎回來' })).toBeHidden({ timeout: 6000 });
    await expect(page.getByRole('button', { name: '登入' })).toHaveCount(0);
  });

  test('以訪客身份登入 → 顯示訪客提示', async ({ page }) => {
    await mockEndpoint(page, '/auth/guest', {}, 200);

    await page.getByRole('button', { name: '登入' }).click();
    await page.getByRole('button', { name: '以訪客身份登入' }).click();

    await expect(page.getByText('已以訪客身份登入')).toBeVisible();
  });

  test('點擊 header「註冊」開啟註冊 popup', async ({ page }) => {
    await page.getByRole('button', { name: '註冊' }).click();

    await expect(page.getByRole('heading', { name: '歡迎加入' })).toBeVisible();
  });
});
