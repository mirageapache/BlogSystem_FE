import { RqResponseType } from './apiType';

/** 使用者資料型別 */
export interface UserDataType {
  _id: string;
  userId: string;
  email: string;
  account: string;
  name: string;
  avatar: string;
  avatarId: string;
  bgColor: string;
  bio: string;
  userRole: number;
  createdAt: string;
  status: number;
  isFollow?: boolean; // 判斷是否追蹤
  followState?: number; // 判斷追蹤狀態
}

/** 使用者設定資料型別 */
export interface UserSettingType {
  language: string;
  theme: number;
  emailPrompt: boolean;
  mobilePrompt: boolean;
}

/** 使用者資訊版型別 */
export interface UserInfoPanelType {
  _id: string;
  account: string;
  name: string;
  avatar: string;
  bgColor: string;
}

/** user edit API 參數型別 */
export interface UserEditVariablesType {
  email: string;
  account: string;
  name: string;
  bio: string;
  avatar: string;
  avatarId: string;
  removeAvatar: boolean;
  language: string;
  emailPrompt: boolean;
  mobilePrompt: boolean;
}

/** 使用者個人資訊
 * [包含 userDataType 及 userSettingType ]
 * */
export interface UserProfileType extends UserDataType, UserSettingType {}

/** user react-query Result 型別 */
export interface UserResultType extends RqResponseType {
  data: UserDataType | null;
}
