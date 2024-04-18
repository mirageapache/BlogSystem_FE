/** 使用者資料型別 */
export interface UserDataType {
  userId: string;
  email: string;
  account: string;
  name: string;
  avatar: string;
  bio: string;
  userRole: number;
  createdAt: string;
  status: number;
}

/** 使用者設定資料型別 */
export interface UserSettingType {
  language: string;
  theme: number;
  tags: string[];
  emailPrompt: Boolean;
  mobilePrompt: Boolean;
}
