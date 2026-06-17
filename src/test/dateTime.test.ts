// utils/dateTime.ts 測試（Phase 3.1 Batch B）
// 對應 UPGRADE_PLAN 3.1 第 4 項：跨月、跨年、未來時間、相對時間。
import { calcTimeDiff, formatDateTime, formateDate, formateMonth } from '../utils/dateTime';

describe('utils/dateTime', () => {
  describe('calcTimeDiff（傳入秒數）', () => {
    const now = 1_000_000;
    test('不足 1 分鐘 → 剛剛', () => {
      expect(calcTimeDiff(now, now - 30)).toBe('剛剛');
    });
    test('數分鐘前', () => {
      expect(calcTimeDiff(now, now - 5 * 60)).toBe('5 分鐘前');
    });
    test('數小時前', () => {
      expect(calcTimeDiff(now, now - 3 * 60 * 60)).toBe('3 小時前');
    });
    test('超過 24 小時 → 1 天', () => {
      expect(calcTimeDiff(now, now - 25 * 60 * 60)).toBe('1 天');
    });
    test('用絕對值處理未來時間', () => {
      expect(calcTimeDiff(now, now + 5 * 60)).toBe('5 分鐘前');
    });
  });

  describe('formatDateTime（以固定系統時間 2026-06-15 12:00 為基準）', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test('同日數分鐘前 → 相對時間', () => {
      expect(formatDateTime(new Date(2026, 5, 15, 11, 30, 0).toISOString())).toBe('30 分鐘前');
    });

    test('同日數小時前 → 相對時間', () => {
      expect(formatDateTime(new Date(2026, 5, 15, 9, 0, 0).toISOString())).toBe('3 小時前');
    });

    test('2~6 天內 → 以天數顯示', () => {
      expect(formatDateTime(new Date(2026, 5, 12, 12, 0, 0).toISOString())).toBe('3天');
    });

    test('同年但超過一週 → M月D日', () => {
      expect(formatDateTime(new Date(2026, 0, 10, 12, 0, 0).toISOString())).toBe('1月10日');
    });

    test('跨年 → YYYY年M月D日', () => {
      expect(formatDateTime(new Date(2025, 11, 31, 12, 0, 0).toISOString())).toBe('2025年12月31日');
    });
  });

  describe('formateDate / formateMonth（不足 10 補 0）', () => {
    test('數字 < 10 補零', () => {
      expect(formateDate(5)).toBe('05');
      expect(formateMonth(9)).toBe('09');
    });
    test('數字 >= 10 原樣', () => {
      expect(formateDate(12)).toBe('12');
      expect(formateMonth(11)).toBe('11');
    });
    test('字串輸入會先轉數字', () => {
      expect(formateDate('7')).toBe('07');
      expect(formateMonth('10')).toBe('10');
    });
  });
});
