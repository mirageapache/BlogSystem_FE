import axios from 'axios';
import { LOCALHOST } from './index';

const baseUrl = LOCALHOST;
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
  const result = await axios
    .post(`${baseUrl}/user/${userId}`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      console.log(res);
      return res.data as UserDataType;
    })
    .catch((error) => {
      throw new Error(error.response?.data?.message || '取得使用者資料時發生錯誤');
    });
  return result;
}
