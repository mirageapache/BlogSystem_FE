import axios from 'axios';
import { API_URL } from './index';
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
      return error.response;
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
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 身分驗證
 * redux 必須存有 userId 才可進行身分驗證
 */
export async function Auth(userId: string) {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
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

/** 找回密碼(寄送連結Email) */
export async function FindPwd(email: string) {
  const result = await axios
    .post(`${baseUrl}/auth/findpwd`, { email })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 重設密碼 */
export async function ResetPwd(token: string, password: string, confirmPassword: string) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const result = await axios
    .post(
      `${baseUrl}/auth/resetpwd`,
      {
        password,
        confirmPassword,
      },
      config
    )
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
