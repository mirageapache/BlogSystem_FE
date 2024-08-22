/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostDataType } from 'types/postType';
import { UserInfoPanelType } from 'types/userType';

export interface PostStateType {
  postId: string;
  postData: PostDataType;
  showCreateModal: boolean;
  showEditModal: boolean;
}

/** UserInfo 預設值 */
const initAuthor: UserInfoPanelType = {
  _id: '',
  account: '',
  name: '',
  avatar: '',
  bgColor: '',
};

/** PostData 預設值 */
const initPostData: PostDataType = {
  _id: '',
  author: initAuthor,
  content: '',
  image: '',
  status: 0,
  subject: '',
  hashTags: [],
  collectionCount: 0,
  shareCount: 0,
  likedByUsers: [],
  comments: [],
  createdAt: '',
  editedAt: '',
  code: '',
  message: '',
};

/** state 預設值 */
const initState = {
  postId: '', // 貼文Id，操作貼文功能時使用
  postData: initPostData, // 暫存選定的貼文資料
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
    /** PostData */
    setPostData(state: PostStateType, action: PayloadAction<PostDataType>) {
      state.postData = action.payload;
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

export const { setPostId, setPostData, setShowCreateModal, setShowEditModal } = postSlice.actions;
export default postSlice.reducer;
