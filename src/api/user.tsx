import axios from 'axios';
import { API_URL } from './index';
import { ResponseType } from '../types/api';

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

export interface UserSettingType {
  language: string;
  theme: number;
  tags: [string];
  emailPrompt: Boolean;
  mobilePrompt: Boolean;
}

interface GetUserProfileType extends ResponseType {
  data: UserDataType;
}

/** 取得使用者詳細資料 */
export async function getUserProfile(userId: string): Promise<GetUserProfileType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const result = await axios
    .post(`${baseUrl}/user/${userId}`, null, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
      // throw new Error(error.response?.data?.message || '取得使用者資料時發生錯誤');
    });
  return result;
}
