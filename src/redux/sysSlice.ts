/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SysStateType {
  darkMode: string;
}

/** system state 預設值 */
const initState = {
  darkMode: localStorage.getItem('darkMode') || '', // 深色模式
};

/** system Slice Function */
const sysSlice = createSlice({
  name: 'system',
  initialState: initState,
  reducers: {
    /** 深色模式切換 */
    setDarkMode(state: SysStateType) {
      let newState = '';
      if (state.darkMode === '') {
        newState = 'dark';
      }
      localStorage.setItem('darkMode', newState);
      state.darkMode = newState;
    },
  },
});

export const { setDarkMode } = sysSlice.actions;
export default sysSlice.reducer;
