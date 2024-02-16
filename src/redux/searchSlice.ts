import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** 
 * 搜尋字串
 * 搜尋類型 [0-文章/1-作者/2-標籤] 
 * */
export interface searchStateType {
  searchText: string;
  searchCategory: number;
}

export interface SearchActionType {
  type: string;
  payload: searchStateType;
}

/** search state 預設值 */
const initState = {
  searchText: '',
  searchCategory: 0,
}

/** Search Slice Function */
const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: {
    /** 設定搜尋自串 */
    setSearchText(state: searchStateType, action: PayloadAction<string>){
      state.searchText = action.payload;
    },
    /** 設定搜尋類型 */
    resetSearchCategory(state: searchStateType, action:PayloadAction<number>){
      state.searchCategory = action.payload;
    },
    /** 重設 search state */ 
    resetSearchState(state: searchStateType){
      state = initState;
    }
  }
})

export const {setSearchText, resetSearchCategory, resetSearchState} = searchSlice.actions;
export default searchSlice.reducer;