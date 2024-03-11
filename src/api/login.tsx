import axios from 'axios';
import bcrypt from 'bcryptjs';
import { DUMMYJSON_URL, LOCALHOST } from './index';

const baseUrl = LOCALHOST;
const saltRounds = bcrypt.genSaltSync(11);

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
  const hashedPwd = await bcrypt.hash(param.password, saltRounds); // 對密碼進行加密
  const hashedCheckPwd = await bcrypt.hash(param.confirmPassword, saltRounds);
  const newParam = { ...param, password: hashedPwd, confirmPassword: hashedCheckPwd };

  const result = await axios
    .post(`${baseUrl}/login/signup`, newParam)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result.response;
}

/** 登入 */
export async function SignIn(param: SignInParamType) {
  const hashedpwd = await bcrypt.hash(param.password, saltRounds); // 加密
  const newParam = { ...param, password: hashedpwd };

  const result = await axios
    .post(`${baseUrl}/signin`, newParam)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
