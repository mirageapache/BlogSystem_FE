import axios from 'axios';
import { AxResponseType } from 'types/apiType';

/* eslint-disable no-unused-vars */
const authToken = localStorage.getItem('authToken');
const localhost = 'http://localhost:3100'; // localhost
const renderServer = 'https://blogsystem-aakz.onrender.com'; // render server

/** 測試資料 dummyjson */
export const DUMMYJSON_URL = 'https://dummyjson.com';

/** base Url */
export const API_URL = renderServer;

export const config = {
  headers: { Authorization: `Bearer ${authToken}` },
};

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
