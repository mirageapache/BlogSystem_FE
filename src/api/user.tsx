import axios from 'axios';
import { hashSync, genSaltSync } from 'bcryptjs';
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
export async function getUserProfile(userId: string) {
  
  const result = await axios
    .post(`${baseUrl}/user/${userId}`, null, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      }  
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

