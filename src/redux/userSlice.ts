/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile } from 'api/user';
import { isEmpty } from 'lodash';

// --- functions ---
import { getCookies } from 'utils/common';

export interface UserDataType {
  uid: string;
  account: string;
  name: string;
  avatar: string;
  status: number;
  theme: number;
}

export interface UserStateType {
  userData: UserDataType;
}

/** user state 預設值 */
const initState = {
  userData: {
    uid: '',
    account: '',
    name: '',
    avatar: '',
    status: 0,
    theme: 0,
  },
};

// getUserData
const getUserData = async (uid: string) => {
  const res = await getUserProfile(uid);
  console.log(res);
};

const authToken = localStorage.getItem('authToken') || '';
const uid = getCookies('uid');
if (!isEmpty(authToken) && !isEmpty(uid)) {
  getUserData(uid!);
}

/** User Slice Function */
const UserSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    /** 設定User資料 */
    setUserData(state: UserStateType, action: PayloadAction<UserDataType>) {
      console.log(action.payload);
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = UserSlice.actions;
export default UserSlice.reducer;
