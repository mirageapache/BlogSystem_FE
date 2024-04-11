import { get } from 'lodash';
import validator from 'validator';

/**
 * 取得Cookies
 */
export const getCookies = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // 若找不到指定的cookie則返回null
}

