import { RqResponseType } from './apiType';

/** 使用者資料型別 */
export interface UserDataType {
  _id: string;
  userId: string;
  email: string;
  account: string;
  name: string;
  avatar: string;
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
  emailPrompt: Boolean;
  mobilePrompt: Boolean;
}

/** 使用者資訊版型別 */
export interface userInfoPanelType {
  _id: string;
  account: string;
  name: string;
  avatar: string;
  bgColor: string;
}

/** 使用者個人資訊
 * [包含 userDataType 及 userSettingType ]
 * */
export interface userProfileType extends UserDataType, UserSettingType {}

/** user react-query Result 型別 */
export interface UserResultType extends RqResponseType {
  data: UserDataType | null;
}
