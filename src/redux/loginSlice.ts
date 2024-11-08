/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginStateType {
  showSignInPop: boolean;
  showSignUpPop: boolean;
  showForgetPwd: boolean;
}

/** login state 預設值 */
const initState = {
  showSignInPop: false, // 顯示登入 Popup
  showSignUpPop: false, // 顯示註冊 Popup
  showForgetPwd: false, // 顯示忘記密碼 Popup
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
    /** 顯示/關閉忘記密碼Popup */
    setForgetPwd(state: LoginStateType, action: PayloadAction<boolean>) {
      state.showForgetPwd = action.payload;
    },
  },
});

export const { setSignInPop, setSignUpPop, setForgetPwd } = loginSlice.actions;
export default loginSlice.reducer;
