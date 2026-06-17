import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;
const limit = 20;

interface getFollowListType extends AxResponseType {
  data: UserDataType;
}

/** 動態取得追蹤資料 型別 */
interface FollowPageListType extends AxResponseType {
  followList: UserDataType[];
  nextPage: number;
  data: UserDataType[];
}

/** 取得追蹤資料 */
export async function getFollowingList(userId: string, page: number): Promise<FollowPageListType> {
  const result = await axios
    .post(`${baseUrl}/follow/getfollowing`, { userId, page, limit })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得粉絲資料 */
export async function getFollowerList(userId: string, page: number): Promise<FollowPageListType> {
  const result = await axios
    .post(`${baseUrl}/follow/getfollower`, { userId, page, limit })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 追蹤 */
export async function followUser(targetId: string): Promise<getFollowListType> {
  const result = await axios
    .post(`${baseUrl}/follow/follow`, { targetId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取消追蹤 */
export async function unfollowUser(targetId: string): Promise<getFollowListType> {
  const result = await axios
    .post(`${baseUrl}/follow/unfollow`, { targetId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 更改訂閱狀態 */
export async function changeFollowState(
  targetId: string,
  state: number
): Promise<getFollowListType> {
  const result = await axios
    .patch(`${baseUrl}/follow/changeState`, { targetId, state })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
