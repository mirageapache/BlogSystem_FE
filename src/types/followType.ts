import { RqResponseType } from './apiType';
import { UserDataType } from './userType';

/** 追蹤資料型別 */
export interface FollowListType {
  user: UserDataType;
  follow: string[];
  follower: object[];
}

/** follow react-query Result 型別 */
export interface FollowResultType extends RqResponseType {
  data: FollowListType | null;
}
