// api 層測試（Phase 3.1 Batch B）：以 msw 攔截真實 axios 請求，
// 驗證 api 函式「成功回 res、失敗回 error.response」的慣例（較 vi.mock 整個模組更貼近實際）。
// base URL 由 vite.config.ts test.env.VITE_API_URL 提供（http://localhost/api）。
import { http, HttpResponse } from 'msw';
import { server } from './msw/server';
import { SignIn } from '../api/auth';

const SIGNIN_URL = 'http://localhost/api/auth/signin';

describe('api/auth SignIn（msw）', () => {
  test('登入成功 → 回傳 res（status 200 + data）', async () => {
    server.use(
      http.post(SIGNIN_URL, () => HttpResponse.json({ message: '登入成功' }, { status: 200 }))
    );

    const res = await SignIn({ email: 'user@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: '登入成功' });
  });

  test('400 錯誤 → catch 後回傳 error.response（含 code / status）', async () => {
    server.use(
      http.post(SIGNIN_URL, () =>
        HttpResponse.json({ code: 'INVALID_PARAM', message: '參數有誤' }, { status: 400 })
      )
    );

    const res = await SignIn({ email: 'user@example.com', password: 'x' });
    expect(res.status).toBe(400);
    expect(res.data.code).toBe('INVALID_PARAM');
  });
});
