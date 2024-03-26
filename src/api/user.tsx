import axios from 'axios';
import { hashSync, genSaltSync } from 'bcryptjs';
import { LOCALHOST } from './index';

const baseUrl = LOCALHOST;
const authToken = localStorage.getItem('authToken');

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

/** 登入參數型別 */
export interface SignInParamType {
  email: string;
  password: string;
}

/** 登入 */
export async function SignIn(param: SignInParamType) {
  const hashedpwd = hashSync(param.password, genSaltSync(11));
  const newParam = { ...param, password: hashedpwd };

  const result = await axios
    .post(`${baseUrl}/login/signin`, newParam)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
