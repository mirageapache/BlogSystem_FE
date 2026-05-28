import { get, isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import store from '../redux/configStore';
import { setSignInPop } from '../redux/loginSlice';

const swal = withReactContent(Swal);

/** 後端統一回傳的錯誤代碼 */
export const API_ERROR_CODE = {
  GUEST_FORBIDDEN: 'GUEST_FORBIDDEN',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INVALID: 'INVALID',
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

  if (status === 400 && code === API_ERROR_CODE.INVALID) {
    errorAlert(message || '參數有誤，請重新確認');
    return true;
  }

  return false;
};
