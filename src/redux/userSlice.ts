/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserStateType {
  userAccount: string;
  userName: string;
}

/** user state 預設值 */
const initState = {
  userAccount: '',
  userName: '',
};

/** User Slice Function */
const UserSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    /** 設定User資料 */
    setUserData(state: UserStateType, action: PayloadAction<UserStateType>) {
      state = action.payload;
    },
  },
});

export const { setUserData } = UserSlice.actions;
export default UserSlice.reducer;
