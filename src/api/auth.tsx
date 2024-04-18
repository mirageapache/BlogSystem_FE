import axios from 'axios';
import { API_URL } from './index';
import { SignUpParamType, SignInParamType } from '../types/authType';

const baseUrl = API_URL;

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
