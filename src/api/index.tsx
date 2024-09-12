import axios from 'axios';
import { AxResponseType } from 'types/apiType';

/* eslint-disable no-unused-vars */
const authToken = localStorage.getItem('authToken');
const localhost = 'http://localhost:3100'; // localhost
const renderServer = 'https://blogsystem-aakz.onrender.com'; // render server

/** 測試資料 dummyjson */
export const DUMMYJSON_URL = 'https://dummyjson.com';

/** base Url */
export const API_URL = localhost;

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

/** 上傳圖片 */
export async function uploadImage(avatarFile: any): Promise<string> {
  const imgurClientId = process.env.REACT_APP_IMGUR_CLIENT;
  if (!avatarFile) return 'NO_FILE';
  const formData = new FormData();
  formData.append('image', avatarFile);

  const result = await axios
    .post('https://api.imgur.com/3/image', formData, {
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
      },
    })
    .then((res) => {
      console.log(res);
      return res.data.data;
    })
    .catch((error) => {
      console.error('上傳失敗:', error);
      return 'UPLOAD_FAILED';
    });
  return result;
}
