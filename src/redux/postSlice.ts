/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PostStateType {
  postId: string;
  showCreateModal: boolean;
  showEditModal: boolean;
}

/** state 預設值 */
const initState = {
  postId: '', // 貼文Id，操作貼文功能時使用
  showCreateModal: false, // 是否顯示CreateModal
  showEditModal: false, // 是否顯示EditModal
};

/** post Slice Function */
const postSlice = createSlice({
  name: 'post',
  initialState: initState,
  reducers: {
    /** PostId */
    setPostId(state: PostStateType, action: PayloadAction<string>) {
      state.postId = action.payload;
    },
    /** 顯示CreateModal */
    setShowCreateModal(state: PostStateType, action: PayloadAction<boolean>) {
      state.showCreateModal = action.payload;
    },
    /** 顯示EditModal */
    setShowEditModal(state: PostStateType, action: PayloadAction<boolean>) {
      state.showEditModal = action.payload;
    },
  },
});

export const { setPostId, setShowCreateModal, setShowEditModal } = postSlice.actions;
export default postSlice.reducer;
