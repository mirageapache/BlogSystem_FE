import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 搜尋字串
 * 搜尋類型 [0-文章/1-作者/2-標籤]
 * */
export interface SearchStateType {
  searchText: string;
  searchCategory: number;
}

/** search state 預設值 */
const initState = {
  searchText: '',
  searchCategory: 0,
};

/** Search Slice Function */
const searchSlice = createSlice({
  name: 'search',
  initialState: initState,
  reducers: {
    /** 設定搜尋自串 */
    setSearchText(state: SearchStateType, action: PayloadAction<string>) {
      const newState = { ...state, searchText: action.payload };
      return newState;
    },
    /** 設定搜尋類型 */
    resetSearchCategory(state: SearchStateType, action: PayloadAction<number>) {
      const newState = { ...state, searchCategory: action.payload };
      return newState;
    },
    /** 重設 search state */
    resetSearchState() {
      return initState;
    },
  },
});

export const { setSearchText, resetSearchCategory, resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;
