import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

/** Search Slice Function */
const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: {
    /** 設定搜尋自串 */
    setSearchText(state: SearchStateType, action: PayloadAction<string>){
      state.searchText = action.payload;
    },
    /** 設定搜尋類型 */
    resetSearchCategory(state: SearchStateType, action:PayloadAction<number>){
      state.searchCategory = action.payload;
    },
    /** 重設 search state */ 
    resetSearchState(state: SearchStateType){
      state = initState;
    }
  }
})

export const {setSearchText, resetSearchCategory, resetSearchState} = searchSlice.actions;
export default searchSlice.reducer;