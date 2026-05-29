/* eslint-disable no-plusplus */
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import { UserProfileType } from 'types/userType';
import store from '../redux/configStore';
import { GUEST_BLOCK_MSG, GUEST_USER_ID } from '../constants/StringConstants';

/**
 * 判斷是否登入（讀取 Redux store，不依賴 cookie）
 */
export const checkLogin = () => {
  const { userData } = store.getState().user;
  return !isEmpty(userData);
};

/**
 * 判斷目前登入者是否為訪客
 * 訪客的 userRole === -1（或 userId 為固定的 GUEST_USER_ID）
 */
export const checkVisitor = () => {
  const userData = store.getState().user.userData as UserProfileType | undefined;
  if (!userData) return false;
  return userData.userRole === -1 || userData.userId === GUEST_USER_ID;
};

/**
 * 訪客行為守衛：若目前為訪客，跳出提示並回傳 true，呼叫端應立即 return。
 */
export const guardVisitorAction = (): boolean => {
  if (!checkVisitor()) return false;
  Swal.fire({
    title: '訪客無法使用此功能',
    text: GUEST_BLOCK_MSG,
    icon: 'info',
    confirmButtonText: '確認',
  });
  return true;
};

/** 頭貼背景色 hex → tailwind class 查表 */
const BG_COLOR_MAP: Record<string, string> = {
  '#ef4444': 'bg-red-500',
  '#f97316': 'bg-orange-500',
  '#f59e0b': 'bg-amber-500',
  '#eab308': 'bg-yellow-500',
  '#84cc16': 'bg-lime-500',
  '#22c55e': 'bg-green-500',
  '#10b981': 'bg-emerald-500',
  '#14b8a6': 'bg-teal-500',
  '#06b6d4': 'bg-cyan-500',
  '#0ea5e9': 'bg-sky-500',
  '#3b82f6': 'bg-blue-500',
  '#6366f1': 'bg-indigo-500',
  '#8b5cf6': 'bg-violet-500',
  '#a855f7': 'bg-purple-500',
  '#d946ef': 'bg-fuchsia-500',
  '#ec4899': 'bg-pink-500',
  '#f43f5e': 'bg-rose-500',
  '#78716c': 'bg-stone-500',
};

export const bgColorConvert = (color: string) => BG_COLOR_MAP[color] ?? 'bg-sky-600';

/** 捲動至頁面頂端 */
export const scrollToTop = () => {
  // 檢查瀏覽器是否支援scroll behavior
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 使用平滑滾動
  } else {
    window.scrollTo(0, 0); // 其他情況，簡單直接移動
  }
};

/** 判斷是否確定取消編輯 */
export const checkCancelEdit = async () => {
  let res = false;
  await Swal.fire({
    title: '要取消編輯嗎?',
    text: '系統將不會儲存及修改',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '確定',
    cancelButtonText: `取消`,
  }).then((result) => {
    if (result.isConfirmed) res = true;
  });
  return res;
};
