/* eslint-disable no-plusplus */

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
