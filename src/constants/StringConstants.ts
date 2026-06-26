import { UserProfileType } from 'types/userType';

export const ERR_NETWORK_MSG = '與伺服器連線異常，請稍候再試！';

/** 訪客身份識別 id（後端不會回傳 user data，前端用此值在 redux 顯示固定訪客資訊） */
export const GUEST_USER_ID = 'guest';

/** 訪客固定資料 — 在訪客登入時填入 redux userData，讓 UI 有資料可顯示 */
export const GUEST_USER_DATA: UserProfileType = {
  _id: GUEST_USER_ID,
  userId: GUEST_USER_ID,
  email: '',
  account: 'visitor',
  name: '訪客',
  avatar: '',
  avatarId: '',
  bgColor: '#78716c',
  bio: '',
  userRole: -1,
  createdAt: '',
  status: 1,
  language: 'zh-TW',
  theme: 0,
  emailPrompt: false,
  mobilePrompt: false,
};

/** 訪客被擋下時顯示的提示文字 */
export const GUEST_BLOCK_MSG = '訪客身份僅供瀏覽，請註冊或登入後才能使用此功能';

export const ARTICLE_STATUS = {
  DRAFT: 0, // 草稿
  PUBLIC: 1, // 發佈（公開）
  MEMBER: 2, // 發佈（限閱）
  OFFLINE: 3, // 下架
} as const;
