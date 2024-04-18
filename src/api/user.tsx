import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;
const authToken = localStorage.getItem('authToken');

interface GetUserProfileType extends AxResponseType {
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
    });
  return result;
}
