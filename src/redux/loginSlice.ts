/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginStateType {
  showSignInPop: boolean;
  showSignUpPop: boolean;
}

/** login state 預設值 */
const initState = {
  showSignInPop: false, // 顯示登入Popup
  showSignUpPop: false, // 顯示註冊Popup
};

/** Login Slice Function */
const loginSlice = createSlice({
  name: 'login',
  initialState: initState,
  reducers: {
    /** 顯示/關閉登入Popup */
    setSignInPop(state: LoginStateType, action: PayloadAction<boolean>) {
      state.showSignInPop = action.payload;
    },
    /** 顯示/關閉註冊Popup */
    setSignUpPop(state: LoginStateType, action: PayloadAction<boolean>) {
      state.showSignUpPop = action.payload;
    },
  },
});

export const { setSignInPop, setSignUpPop } = loginSlice.actions;
export default loginSlice.reducer;
