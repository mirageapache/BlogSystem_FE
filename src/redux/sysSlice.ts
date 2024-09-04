/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SysStateType {
  darkMode: string;
  editMode: boolean;
  activePage: string;
  exploreTag: string;
}

const path = window.location.pathname.split('/')[1];
/** system state 預設值 */
const initState = {
  darkMode: localStorage.getItem('darkMode') || '', // 深色模式
  editMode: false, // 文章或貼文的編輯狀態
  activePage: path, // 當前頁面路徑，用來判斷作用中的頁籤
  exploreTag: 'article', // 紀錄"探索頁"使用中的tag頁籤
};

/** system Slice Function */
const sysSlice = createSlice({
  name: 'system',
  initialState: initState,
  reducers: {
    /** 設定SideBar、MainMenu、ButtonMenu選單作用中頁籤 */
    setActivePage(state: SysStateType, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },
    /** 設定探索頁作用中頁籤 */
    setExploreTag(state: SysStateType, action: PayloadAction<string>) {
      state.exploreTag = action.payload;
    },
    /** 編輯模式切換 */
    setEditMode(state: SysStateType, action: PayloadAction<boolean>) {
      state.editMode = action.payload;
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

export const { setActivePage, setExploreTag, setEditMode, setDarkMode } = sysSlice.actions;
export default sysSlice.reducer;
