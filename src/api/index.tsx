import axios from 'axios';
import { AxResponseType } from 'types/apiType';

/* eslint-disable no-unused-vars */
/** base Url */
export const API_URL = process.env.REACT_APP_API_URL;

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

/** 上傳圖片至cloudinary */
export async function uploadImage(imageFile: any) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'blogSystem'); // 在 Cloudinary 創建的 unsigned preset 名稱
  formData.append('cloud_name', 'db9878jd4'); // Cloudinary Cloud 名稱

  const result = await axios
    .post('https://api.cloudinary.com/v1_1/db9878jd4/image/upload', formData)
    .then((response) => {
      return response.data.secure_url; // 獲取上傳後的圖片 URL
    })
    .catch((err) => {
      return err;
    });

  return result;
}
