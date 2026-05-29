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
  userList: UserDataType[];
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
 * @page 要取得的資料頁碼
 *
 * 當前登入者身份由後端從 JWT 取得，前端不必傳。
 */
export async function getSearchUserList(
  page: number,
  searchString?: string
): Promise<UserPageListType> {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${baseUrl}/user/getSearchUserList`, { searchString, page, limit })
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
 *
 * 當前登入者身份由後端從 JWT 取得，前端不必傳。
 */
export async function getRecommendUserList(): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/getRecommendUserList`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得自己的使用者資料（後端從 JWT 解析身份） */
export async function getOwnProfile(): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/own`, null)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得一般使用者詳細資料 */
export async function getUserProfile(userId: string): Promise<GetUserProfileType> {
  const result = await axios
    .post(`${baseUrl}/user/${userId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 更新使用者資料 */
export async function updateProfile(formData: FormData): Promise<GetUserProfileType> {
  const result = await axios
    .patch(`${baseUrl}/user/own`, formData)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
