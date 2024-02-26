import axios from 'axios';
import { DUMMYJSON_URL } from './index';

const baseUrl = '';

/** 註冊參數型別 */
export interface SignUpParamType {
  account: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface SignInParamType {
  account: string;
  password: string;
}

/** 註冊 */
export async function SignUp(param: SignUpParamType) {
  const result = await axios
    .post(`${baseUrl}/signup`, param)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

/** 登入 */
export async function SignIn(param: SignInParamType) {
  const result = await axios
    .post(`${baseUrl}/signin`, param)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
