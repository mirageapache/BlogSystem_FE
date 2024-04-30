import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;

interface GetUserProfileType extends AxResponseType {
  data: UserDataType;
}

/** 取得自己的使用者資料
 * 須帶authToken做驗證
 */
export async function getOwnProfile(
  userId: string,
  authToken: string
): Promise<GetUserProfileType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const result = await axios
    .post(`${baseUrl}/user/own/${userId}`, null, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得一般使用者詳細資料 */
export async function getUserProfile(userId: string): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/${userId}`, null)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 更新使用者資料 */
export async function updateProfile(
  formData: UserDataType,
  userId: string,
  authToken: string
) {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  formData = { ...formData, userId };
  const result = await axios
    .patch(`${baseUrl}/user/own/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
