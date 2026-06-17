import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as Sentry from '@sentry/react';
import store from '../redux/configStore';
import { setSignInPop } from '../redux/loginSlice';

const swal = withReactContent(Swal);

/** 後端統一回傳的錯誤代碼 */
export const API_ERROR_CODE = {
  GUEST_FORBIDDEN: 'GUEST_FORBIDDEN',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INVALID: 'INVALID',
  INVALID_PARAM: 'INVALID_PARAM',
  UPLOAD_ERR: 'UPLOAD_ERR',
  SYSTEM_ERR: 'SYSTEM_ERR',
  UN_AUTH: 'UN_AUTH',
  RATE_LIMIT: 'RATE_LIMIT',
} as const;

/** 錯誤提醒(一般型式) */
export const errorAlert = (errorMsg?: string) => {
  swal.fire({
    title: !isEmpty(errorMsg) ? errorMsg : '發生一些錯誤，請稍候再試',
    icon: 'error',
    confirmButtonText: '確認',
  });
};

/** 處理API狀態碼 */
export const handleStatus = (apiStatus: number) => {
  return Math.floor(apiStatus / 100);
};

/**
 * 將「非預期」的 API 錯誤上報 Sentry
 * 預期內的業務錯誤 (401/403/404/429/驗證失敗) 屬正常流程，不上報以免雜訊
 * 只有 5XX 與無法辨識的回應 (含網路不通、無 response) 才送
 */
const reportApiError = (res: any, reason: string) => {
  const status = get(res, 'status');
  const code = get(res, 'data.code');
  const message = get(res, 'data.message');
  const url = get(res, 'config.url');
  const method = get(res, 'config.method');

  Sentry.captureException(
    new Error(`[API] ${reason}（${method ?? '-'} ${url ?? '-'} → ${status ?? 'no-response'}）`),
    {
      level: 'error',
      // 依「狀態碼 + 後端錯誤碼」 分組，避免所有 API 錯誤被併成同一個 issue
      fingerprint: ['api-error', String(status ?? 'network'), code ?? 'unknown'],
      tags: { api_status: status ? String(status) : 'network', api_code: code ?? 'unknown' },
      extra: { url, method, status, code, message },
    }
  );
};

/** 統一處理寫入 API 的 4xx 錯誤回應
 * - GUEST_FORBIDDEN：訪客身分嘗試寫入 → 提示登入並彈出登入框
 * - FORBIDDEN：非資源擁有者 → 提示無權限
 * - NOT_FOUND：資源不存在 → 提示已刪除
 * - INVALID：參數不合法（如 ObjectId 格式錯誤）→ 一般錯誤
 *
 * 回傳值：是否已被本工具處理。callers 收到 true 時應停止後續流程（例如不要再 refetch）。
 */
export const handleApiError = (res: any): boolean => {
  const status = get(res, 'status');
  const code = get(res, 'data.code');
  const message = get(res, 'data.message');

  // token 失效：UI（清狀態 + 彈登入）已由 api/index.tsx 的 axios interceptor 全域處理，
  // 此處僅回報「已處理」讓 caller 停止後續流程，避免重複跳提示。
  if (status === 401 && code === API_ERROR_CODE.UN_AUTH) {
    return true;
  }

  // 請求過於頻繁（限速）
  if (status === 429 || code === API_ERROR_CODE.RATE_LIMIT) {
    errorAlert(message || '操作過於頻繁，請稍後再試');
    return true;
  }

  if (status === 403 && code === API_ERROR_CODE.GUEST_FORBIDDEN) {
    swal
      .fire({
        title: '請先登入',
        text: '此功能需要登入後才能使用',
        icon: 'info',
        confirmButtonText: '前往登入',
      })
      .then(() => {
        store.dispatch(setSignInPop(true));
      });
    return true;
  }

  if (status === 403 && code === API_ERROR_CODE.FORBIDDEN) {
    errorAlert('你沒有權限執行此操作');
    return true;
  }

  if (status === 404 && code === API_ERROR_CODE.NOT_FOUND) {
    errorAlert(message || '資料不存在或已被刪除');
    return true;
  }

  if (
    status === 400 &&
    (code === API_ERROR_CODE.INVALID || code === API_ERROR_CODE.INVALID_PARAM)
  ) {
    errorAlert(message || '參數有誤，請重新確認');
    return true;
  }

  // 圖片上傳失敗（檔案過大 / 副檔名不符），後端訊息較具體可直接顯示
  if (status === 400 && code === API_ERROR_CODE.UPLOAD_ERR) {
    errorAlert(message || '圖片上傳失敗，請確認檔案大小與格式');
    return true;
  }

  // 5xx 統一友善文案，避免洩漏後端錯誤細節
  if (status >= 500 || code === API_ERROR_CODE.SYSTEM_ERR) {
    reportApiError(res, '伺服器錯誤');
    errorAlert('系統發生錯誤，請稍後再試');
    return true;
  }

  // 無法辨識的回應（可能是網路錯誤導致沒有 response）也上報 Sentry，方便追蹤
  if (status === undefined || status >= 400) {
    reportApiError(res, '未預期的 API 錯誤');
  }
  return false;
};
