import axios from 'axios';
import { LOCALHOST } from './index';

const baseUrl = LOCALHOST;

/** 註冊參數型別 */
export interface SignUpParamType {
  email: string;
  password: string;
  confirmPassword: string;
}

/** 註冊 */
export async function SignUp(param: SignUpParamType) {
  const result = await axios
    .post(`${baseUrl}/login/signup`, param)
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
  const result = await axios
    .post(`${baseUrl}/login/signin`, param)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
