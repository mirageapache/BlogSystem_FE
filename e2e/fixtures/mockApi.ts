import { Page, Route } from '@playwright/test';

/**
 * E2E API mock 工具（Phase 3.2）
 *
 * 後端為獨立 repo、smoke set 不依賴 test DB，所以用 page.route 在瀏覽器端
 * 攔截 axios 請求並回傳假資料。所有 helper 的 glob 都是 host-agnostic
 * （`** /<path>`），無論 VITE_API_URL 指向 localhost:3500 或為空都能對得上。
 */

/** 一筆完整且可被 PostItem 安全渲染的貼文（欄位對齊 src/types/postType.ts） */
export const SAMPLE_POST = {
  _id: 'post-e2e-1',
  author: {
    _id: 'author-1',
    account: 'tester',
    name: '測試作者',
    avatar: '',
    bgColor: '#3b82f6',
  },
  content: '<div>這是一則 E2E 測試貼文內容</div>',
  image: '',
  imageId: '',
  status: 1,
  subject: '',
  hashTags: [],
  collectionCount: 0,
  shareCount: 0,
  likedByUsers: [],
  comments: [],
  createdAt: '2026-05-01T08:00:00.000Z',
  editedAt: '',
};

/** 登入成功時後端回傳格式：{ userData: {...} }（對齊 SignInPopup handleSignInSuccess） */
export const SAMPLE_USER = {
  userData: {
    userId: 'user-e2e-1',
    account: 'tester',
    name: '測試員',
    email: 'user@example.com',
    avatar: '',
    bgColor: '#3b82f6',
    userRole: 1,
  },
};

/** 以 JSON 回應某個請求 */
function fulfillJson(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/** 攔截指定 path（host 無關），回傳給定 JSON */
export async function mockEndpoint(page: Page, pathGlob: string, body: unknown, status = 200) {
  await page.route(`**${pathGlob}`, (route) => fulfillJson(route, body, status));
}

/** 後端 API 的 origin（取自 .env 的 VITE_API_URL=http://localhost:3500/api） */
export const API_ORIGIN = 'http://localhost:3500';

/**
 * 安裝 API 攔截「保底」層：任何打到後端 API origin 的請求一律回 200 {}，
 * 避免未明確 mock 的請求外洩到真實網路（造成 hang / 不穩）。
 *
 * 必須以 origin（非 path 段）界定範圍：dev server 會以 `/src/pages/post/…`、
 * `/src/api/…` 這類路徑提供前端模組，若用 path 段比對會誤攔而導致整個 app 無法載入。
 * 後端 API 在另一個 origin（:3500），與 dev 資產（:4399）天然隔離。
 *
 * 註：Playwright 後註冊的 route 優先，故各 spec 在呼叫本函式後再 mock 個別端點即可覆寫；
 * 個別端點用 host-agnostic 的 `**<path>` glob，origin 不同也能對上。
 */
export async function installApiFallback(page: Page) {
  await page.route(`${API_ORIGIN}/**`, (route) => fulfillJson(route, {}));
}
