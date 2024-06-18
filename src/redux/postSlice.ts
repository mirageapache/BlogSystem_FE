/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PostStateType {
  showCreateModal: boolean;
}

/** state 預設值 */
const initState = {
  showCreateModal: false, // 是否顯示CreateModal
};

/** post Slice Function */
const postSlice = createSlice({
  name: 'post',
  initialState: initState,
  reducers: {
    /** 顯示CreateModal */
    setShowCreateModal(state: PostStateType, action: PayloadAction<boolean>) {
      state.showCreateModal = action.payload;
    },
  },
});

export const { setShowCreateModal } = postSlice.actions;
export default postSlice.reducer;
