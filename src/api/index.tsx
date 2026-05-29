import axios from 'axios';
import { AxResponseType } from 'types/apiType';

/* eslint-disable no-unused-vars */
/** base Url */
export const API_URL = process.env.REACT_APP_API_URL;

// 讓所有 axios 請求自動帶上 cookie（後端改用 HttpOnly Cookie 存 JWT 時需要）
axios.defaults.withCredentials = true;

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
