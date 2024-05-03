/* eslint-disable no-plusplus */
import { isEmpty } from 'lodash';

/**
 * 取得Cookies
 */
export const getCookies = (name: string) => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // 若找不到指定的cookie則返回null
};

/**
 * 判斷是否登入
 */
export const checkLogin = () => {
  const id = getCookies('uid');
  const token = localStorage.getItem('authToken');
  if (!isEmpty(id) && !isEmpty(token)) {
    return true;
  }
  return false;
};

/**
 * 頭貼背景色轉換
 * '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
 * '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78716c'
 */
export const bgColorConvert = (color: string) => {
  switch (color) {
    case '#ef4444':
      return 'bg-red-500';
    case '#f97316':
      return 'bg-orange-500';
    case '#f59e0b':
      return 'bg-amber-500';
    case '#eab308':
      return 'bg-yellow-500';
    case '#84cc16':
      return 'bg-lime-500';
    case '#22c55e':
      return 'bg-green-500';
    case '#10b981':
      return 'bg-emerald-500';
    case '#14b8a6':
      return 'bg-teal-500';
    case '#06b6d4':
      return 'bg-cyan-500';
    case '#0ea5e9':
      return 'bg-sky-500';
    case '#3b82f6':
      return 'bg-blue-500';
    case '#6366f1':
      return 'bg-indigo-500';
    case '#8b5cf6':
      return 'bg-violet-500';
    case '#a855f7':
      return 'bg-purple-500';
    case '#d946ef':
      return 'bg-fuchsia-500';
    case '#ec4899':
      return 'bg-pink-500';
    case '#f43f5e':
      return 'bg-rose-500';
    case '#78716c':
      return 'bg-stone-500';
    default:
      return 'bg-sky-600';
  }
};
