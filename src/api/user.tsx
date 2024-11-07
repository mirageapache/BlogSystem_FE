import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;
const limit = 20;

interface GetUserProfileType extends AxResponseType {
  data: UserDataType;
}

/** 動態取得使用者資料 型別 */
interface UserPageListType extends AxResponseType {
  userList: any;
  nextPage: number;
  data: UserDataType[];
}

/** 取得所有使用者 */
export async function getAllUserList(): Promise<GetUserProfileType> {
  const result = await axios
    .get(`${baseUrl}/user`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得搜尋使用者清單(含follow資料)
 * @searchString [搜尋字串]
 * @userId [當前登入的使用者Id] - 用來判斷isFollow
 * @page 要取得的資料頁碼
 */
export async function getSearchUserList(
  page: number,
  searchString?: string,
  userId?: string
): Promise<UserPageListType> {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${baseUrl}/user/getSearchUserList`, { searchString, userId, page, limit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response;
      });
  }
  return result;
}

/** 取得推薦使用者清單(含follow資料)
 * @userId [當前登入的使用者Id] - 用來判斷isFollow
 */
export async function getRecommendUserList(userId?: string): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/getRecommendUserList`, { userId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得自己的使用者資料(須帶authToken做驗證) */
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
      return error.response;
    });
  return result;
}

/** 取得一般使用者詳細資料 */
export async function getUserProfile(
  userId: string,
  currentUserId: string
): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/${userId}`, { currentUserId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 更新使用者資料 */
export async function updateProfile(
  formData: FormData,
  userId: string,
  authToken: string
): Promise<GetUserProfileType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .patch(`${baseUrl}/user/own/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
