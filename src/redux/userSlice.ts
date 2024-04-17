/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile } from 'api/user';
import { isEmpty } from 'lodash';

// --- functions ---
import { getCookies } from 'utils/common';
// --- types ---
import { UserDataType, UserSettingType } from 'api/user';

interface UserInfoType extends UserDataType {
  theme: number;
}

export interface UserStateType {
  userData: UserDataType;
}

/** user state 預設值 */
const initState = {
  userData: {
    userId: '',
    email: '',
    account: '',
    name: '',
    avatar: '',
    bio: '',
    userRole: 0,
    createdAt: '',
    status: 0,
    theme: 0,
  },
};


/** User Slice Function */
const UserSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    /** 設定User資料 */
    setUserData(state: UserStateType, action: PayloadAction<UserInfoType>) {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = UserSlice.actions;
export default UserSlice.reducer;
