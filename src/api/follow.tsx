import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;

interface getFollowListType extends AxResponseType {
  data: UserDataType;
}

/** 取得追蹤&粉絲資料 */
export async function getFollowList(userId: string): Promise<getFollowListType> {
  const result = await axios
    .get(`${baseUrl}/follow?userId=${userId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
