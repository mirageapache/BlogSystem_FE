import axios from 'axios';
import bcrypt from 'bcryptjs';
import { LOCALHOST } from './index';

const baseUrl = LOCALHOST;
const saltRounds = bcrypt.genSaltSync(11);

/** 註冊參數型別 */
export interface SignUpParamType {
  email: string;
  password: string;
  confirmPassword: string;
}

/** 註冊 */
export async function SignUp(param: SignUpParamType) {
  const hashedPwd = await bcrypt.hash(param.password, saltRounds); // 對密碼進行加密
  const newParam = { ...param, password: hashedPwd };

  const result = await axios
    .post(`${baseUrl}/login/signup`, newParam)
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
  // bcrypt.compare 是用明碼和密碼比對，還要再研究怎麼實作加密傳送
  // const hashedpwd = await bcrypt.hash(param.password, saltRounds);
  // const newParam = { ...param, password: hashedpwd };

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
