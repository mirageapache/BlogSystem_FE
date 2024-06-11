import axios from 'axios';
import { API_URL } from './index';
import { AxResponseType } from '../types/apiType';
import { UserDataType } from '../types/userType';

const baseUrl = API_URL;
const authToken = localStorage.getItem('authToken');

interface getFollowListType extends AxResponseType {
  data: UserDataType;
}

/** 取得追蹤資料 */
export async function getFollowingList(userId: string): Promise<getFollowListType> {
  const result = await axios
    .post(`${baseUrl}/follow/following`, { userId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得粉絲資料 */
export async function getFollowerList(userId: string): Promise<getFollowListType> {
  const result = await axios
    .post(`${baseUrl}/follow/follower`, { userId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 追蹤/取消追蹤(其他使用者) */
export async function handleFollowAction(
  action: string, // 'follow' or 'unfollow'
  userId: string, // 當前操作的使用者ID
  targetId: string // 目標使用者ID
  // followState: number // state為訂閱狀態 [0-追蹤(不主動推播) / 1-主動推播]
): Promise<getFollowListType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const result = await axios
    .patch(`${baseUrl}/follow/followAction`, { action, userId, targetId }, config)
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 更改訂閱狀態 */
export async function changeFollowState(
  userId: string,
  targetId: string,
  state: number
): Promise<getFollowListType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const result = await axios
    .patch(`${baseUrl}/follow/changeFollowState`, { userId, targetId, state }, config)
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
