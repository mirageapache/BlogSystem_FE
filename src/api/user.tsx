import axios from 'axios';
import { API_URL } from './index';

const baseUrl = API_URL;
const authToken = localStorage.getItem('authToken');

/** 使用者資料型別 */
export interface UserDataType {
  userId: string;
  email: string;
  account: string;
  name: string;
  avatar: string;
  bio: string;
  userRole: number;
  createdAt: string;
  status: number;
}

/** 取得使用者詳細資料 */
export async function getUserProfile(userId: string): Promise<UserDataType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  console.log(userId);
  console.log(authToken);
  const result = await axios
    .post(`${baseUrl}/user/${userId}`, null, config)
    .then((res) => {
      console.log(res);
      return res.data as UserDataType;
    })
    .catch((error) => {
      return error;
      // throw new Error(error.response?.data?.message || '取得使用者資料時發生錯誤');
    });
  return result;
}
