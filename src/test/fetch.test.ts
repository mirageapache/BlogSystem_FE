// utils/fetch.ts 單元測試（Phase 3.1 Batch B）
// 重點：handleApiError 對每個錯誤碼分支的回傳值與對應提示 / 副作用。
import { handleStatus, handleApiError, API_ERROR_CODE } from '../utils/fetch';
import store from '../redux/configStore';
import { setSignInPop } from '../redux/loginSlice';

// fetch.ts 內 `withReactContent(Swal)` 會在載入時建立 swal 實例，
// 以 vi.hoisted 共用同一個 fire mock，攔截所有提示呼叫。
const { mockFire } = vi.hoisted(() => ({
  mockFire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
}));
vi.mock('sweetalert2', () => ({ default: { fire: mockFire } }));
vi.mock('sweetalert2-react-content', () => ({ default: vi.fn(() => ({ fire: mockFire })) }));

const dispatchSpy = vi.spyOn(store, 'dispatch');

describe('utils/fetch', () => {
  beforeEach(() => {
    mockFire.mockClear();
    dispatchSpy.mockClear();
  });

  describe('handleStatus（取狀態碼百位數）', () => {
    test.each([
      [200, 2],
      [204, 2],
      [400, 4],
      [401, 4],
      [404, 4],
      [429, 4],
      [500, 5],
      [503, 5],
    ])('handleStatus(%i) = %i', (input: number, expected: number) => {
      expect(handleStatus(input)).toBe(expected);
    });
  });

  describe('handleApiError', () => {
    test('未涵蓋的情況（如 200）回傳 false 且不跳提示', () => {
      expect(handleApiError({ status: 200, data: {} })).toBe(false);
      expect(mockFire).not.toHaveBeenCalled();
    });

    test('401 UN_AUTH：回傳 true 但不跳提示（交由 axios interceptor 全域處理）', () => {
      const res = { status: 401, data: { code: API_ERROR_CODE.UN_AUTH } };
      expect(handleApiError(res)).toBe(true);
      expect(mockFire).not.toHaveBeenCalled();
    });

    test('429：限速，回傳 true 並跳錯誤提示', () => {
      expect(handleApiError({ status: 429, data: {} })).toBe(true);
      expect(mockFire).toHaveBeenCalledTimes(1);
    });

    test('RATE_LIMIT code（非 429 狀態）也視為限速', () => {
      expect(handleApiError({ status: 400, data: { code: API_ERROR_CODE.RATE_LIMIT } })).toBe(true);
      expect(mockFire).toHaveBeenCalledTimes(1);
    });

    test('403 GUEST_FORBIDDEN：提示登入並於確認後 dispatch setSignInPop(true)', async () => {
      const res = { status: 403, data: { code: API_ERROR_CODE.GUEST_FORBIDDEN } };
      expect(handleApiError(res)).toBe(true);
      expect(mockFire).toHaveBeenCalledWith(expect.objectContaining({ title: '請先登入' }));
      await vi.waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(setSignInPop(true));
      });
    });

    test('403 FORBIDDEN：無權限提示', () => {
      const res = { status: 403, data: { code: API_ERROR_CODE.FORBIDDEN } };
      expect(handleApiError(res)).toBe(true);
      expect(mockFire).toHaveBeenCalledWith(
        expect.objectContaining({ title: '你沒有權限執行此操作' })
      );
    });

    test('404 NOT_FOUND：使用後端 message（若有）', () => {
      const res = { status: 404, data: { code: API_ERROR_CODE.NOT_FOUND, message: '文章不存在' } };
      expect(handleApiError(res)).toBe(true);
      expect(mockFire).toHaveBeenCalledWith(expect.objectContaining({ title: '文章不存在' }));
    });

    test.each([API_ERROR_CODE.INVALID, API_ERROR_CODE.INVALID_PARAM])(
      '400 %s：參數錯誤提示',
      (code: string) => {
        expect(handleApiError({ status: 400, data: { code } })).toBe(true);
        expect(mockFire).toHaveBeenCalledTimes(1);
      }
    );

    test('400 UPLOAD_ERR：圖片上傳失敗提示', () => {
      expect(handleApiError({ status: 400, data: { code: API_ERROR_CODE.UPLOAD_ERR } })).toBe(true);
      expect(mockFire).toHaveBeenCalledTimes(1);
    });

    test('5xx：統一系統錯誤提示', () => {
      expect(handleApiError({ status: 500, data: {} })).toBe(true);
      expect(mockFire).toHaveBeenCalledWith(
        expect.objectContaining({ title: '系統發生錯誤，請稍後再試' })
      );
    });

    test('SYSTEM_ERR code 也走系統錯誤分支', () => {
      expect(handleApiError({ status: 400, data: { code: API_ERROR_CODE.SYSTEM_ERR } })).toBe(true);
      expect(mockFire).toHaveBeenCalledTimes(1);
    });
  });
});
