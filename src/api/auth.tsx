import axios from 'axios';
import { API_URL, config } from './index';
import { SignUpParamType, SignInParamType } from '../types/authType';

const baseUrl = API_URL;

/** 註冊 */
export async function SignUp(param: SignUpParamType) {
  const result = await axios
    .post(`${baseUrl}/auth/signup`, param)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 登入 */
export async function SignIn(param: SignInParamType) {
  const result = await axios
    .post(`${baseUrl}/auth/signin`, param)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 身分驗證
 * redux 必須存有 userId 才可進行身分驗證
 */
export async function Auth(userId: string) {
  const result = await axios
    .post(`${baseUrl}/auth/checkAuth`, { id: userId }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
