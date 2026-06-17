// utils/common.ts 單元測試 (Phase 3 補測)
import {
  checkLogin,
  checkVisitor,
  guardVisitorAction,
  bgColorConvert,
  scrollToTop,
  checkCancelEdit,
} from '../utils/common';
import store from '../redux/configStore';
import { setUserData, clearUserData } from '../redux/userSlice';
import { GUEST_USER_DATA, GUEST_BLOCK_MSG } from '../constants/StringConstants';

// common.ts 內 `import Swal from 'sweetalert2'`，直接呼叫 Swal.fire。
// 用 vi.hoisted 共用一個 fire mock，攔截所有提示，避免測試真的彈出視窗。
const { mockFire } = vi.hoisted(() => ({
  mockFire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
}));
vi.mock('sweetalert2', () => ({ default: { fire: mockFire } }));

// 每個 test 後復原：清掉 store 的 userData、重置 Swal mock 呼叫紀錄，
// 避免測試間互相污染（前一個測試 dispatch 的 user 殘留到下一個）。
afterEach(() => {
  store.dispatch(clearUserData());
  mockFire.mockClear();
});

describe('checkLogin', () => {
  test('未登入 (userData 為 null) 回傳 false', () => {
    store.dispatch(clearUserData()); // 確保是登出狀態
    expect(checkLogin()).toBe(false);
  });

  test('已登入 (userData 有值) 回傳 true', () => {
    // 用訪客資料當基底，覆寫成一般使用者
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userId: 'u1', userRole: 1 }));
    expect(checkLogin()).toBe(true);
  });
});

describe('checkVisitor', () => {
  test('未登入 (userData 為 null) 回傳 false', () => {
    store.dispatch(clearUserData());
    expect(checkVisitor()).toBe(false);
  });

  test('一般使用者 (userRole !== -1 且 userId !== GUEST_USER_ID) 回傳 false', () => {
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userId: 'u1', userRole: 1 }));
    expect(checkVisitor()).toBe(false);
  });

  test('訪客 (userRole === -1) 回傳 true', () => {
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userRole: -1 }));
    expect(checkVisitor()).toBe(true);
  });

  test('訪客 (userId === GUEST_USER_ID 但 userRole 非 -1) 回傳 true', () => {
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userRole: 1 })); // userId 仍是 'guest'
    expect(checkVisitor()).toBe(true);
  });
});

describe('guardVisitorAction', () => {
  test('非訪客回傳 false', () => {
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userId: 'u1', userRole: 1 }));
    expect(guardVisitorAction()).toBe(false);
    expect(mockFire).not.toHaveBeenCalled();
  });

  test('訪客回傳 true 且跳提示', () => {
    store.dispatch(setUserData({ ...GUEST_USER_DATA, userRole: -1 }));
    expect(guardVisitorAction()).toBe(true);
    expect.objectContaining({
      icon: 'info',
      title: '訪客無法使用此功能喔',
      text: GUEST_BLOCK_MSG,
      confirmButtonText: '確認',
    });
  });
});

describe('bgColorConvert', () => {
  test.each([
    ['#ef4444', 'bg-red-500'],
    ['#22c55e', 'bg-green-500'],
    ['#78716c', 'bg-stone-500'],
  ])('已知色碼 %s 轉對對應的 class', (hex: string, expected: string) => {
    expect(bgColorConvert(hex)).toBe(expected);
  });

  test('未知色碼 回傳預設的 bg-sky-600', () => {
    expect(bgColorConvert('#000000')).toBe('bg-sky-600');
  });
});

describe('scrollToTop', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // 還原 window.scrollTo 的 spy
    // 還原被遮蔽的 style：刪掉自身屬性後會退回原型上的 getter（jsdom 預設）
    Reflect.deleteProperty(document.documentElement, 'style');
  });

  test('瀏覽器支援 scroll behavior', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // jsdom 預設 style 上就有 scrollBehavior，直接走「支援」這條
    scrollToTop();
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('瀏覽器不支援 scroll behavior', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // 用空物件遮蔽 style getter，讓 'scrollBehavior' in style 變 false，逼出「不支援」分支
    Object.defineProperty(document.documentElement, 'style', {
      configurable: true,
      get: () => ({}),
    });
    scrollToTop();
    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  });
});

describe('checkCancelEdit', () => {
  test('使用者取消編輯', async () => {
    mockFire.mockResolvedValueOnce({ isConfirmed: false }); // 模擬使用者點「取消」
    expect(await checkCancelEdit()).toBe(false);
  });

  test('使用者確定取消編輯', async () => {
    mockFire.mockResolvedValueOnce({ isConfirmed: true }); // 模擬使用者點「確認」
    expect(await checkCancelEdit()).toBe(true);
  });
});
