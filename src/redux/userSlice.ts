/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// --- types ---
import { UserDataType } from 'types/userType';

interface UserInfoType extends UserDataType {
  theme: number;
}

export interface UserStateType {
  userData: UserDataType;
}

/** user state 預設值 */
const initState = {
  userData: {
    _id: '',
    userId: '',
    email: '',
    account: '',
    name: '',
    avatar: '',
    bgColor: '',
    bio: '',
    userRole: 0,
    createdAt: '',
    status: 0,
    theme: 0,
  },
};

/** User Slice Function */
const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    /** 設定User資料 */
    setUserData(state: UserStateType, action: PayloadAction<UserInfoType>) {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
