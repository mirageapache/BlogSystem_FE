import axios from 'axios';
import { AxResponseType } from 'types/apiType';
import { get } from 'lodash';
import store from '../redux/configStore';
import { clearUserData } from '../redux/userSlice';
import { setSignInPop } from '../redux/loginSlice';

/* eslint-disable no-unused-vars */
/** base Url */
export const API_URL = import.meta.env.VITE_API_URL;

// 讓所有 axios 請求自動帶上 cookie（後端改用 HttpOnly Cookie 存 JWT 時需要）
axios.defaults.withCredentials = true;

// 全域處理 token 失效（後端 tokenVersion 機制）：
// 登出 / 重設密碼後舊 token 立即失效，任何受保護 API 會回 401 { code: 'UN_AUTH' }。
// 收到時清除本地登入狀態並彈出登入框，讓使用者重新登入。
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = get(error, 'response.status');
    const code = get(error, 'response.data.code');
    if (status === 401 && code === 'UN_AUTH') {
      localStorage.removeItem('hasSession');
      store.dispatch(clearUserData());
      store.dispatch(setSignInPop(true));
    }
    return Promise.reject(error);
  }
);

interface ResultType extends AxResponseType {
  article: number;
  post: number;
  user: number;
  hashtag: number;
}

/** 取得搜尋結果數量 */
export async function getSearchCount(searchString?: string): Promise<ResultType> {
  const result = await axios
    .post(`${API_URL}/utility/searchCount`, { searchString })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
