/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// --- types ---
import { UserProfileType } from 'types/userType';

export interface UserStateType {
  userData: UserProfileType | null;
}

/** user state 預設值 */
const initState: UserStateType = {
  userData: null,
};

/** User Slice Function */
const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    /** 設定User資料 */
    setUserData(state: UserStateType, action: PayloadAction<UserProfileType>) {
      state.userData = action.payload;
    },
    /** 清除User資料（登出 / token 失效時用） */
    clearUserData(state: UserStateType) {
      state.userData = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
