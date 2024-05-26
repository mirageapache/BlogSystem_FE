/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SysStateType {
  darkMode: string;
  activePage: string;
}

const path = window.location.pathname.split('/')[1];
console.log(path);
/** system state 預設值 */
const initState = {
  darkMode: localStorage.getItem('darkMode') || '', // 深色模式
  activePage: path, // 當前頁面路徑，用來判斷作用中的頁籤
};

/** system Slice Function */
const sysSlice = createSlice({
  name: 'system',
  initialState: initState,
  reducers: {
    /** 設定作用中頁籤 */
    setActivePage(state: SysStateType, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },
    /** 深色模式切換 */
    setDarkMode(state) {
      let newState = '';
      if (state.darkMode === '') {
        newState = 'dark';
      }
      localStorage.setItem('darkMode', newState);
      state.darkMode = newState;
    },
  },
});

export const { setActivePage, setDarkMode } = sysSlice.actions;
export default sysSlice.reducer;
