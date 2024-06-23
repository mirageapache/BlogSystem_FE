import { RqResponseType, errorMsgType } from './apiType';
import { userInfoPanelType } from './userType';

/** post API接收資料型別 */
export interface PostDataType extends errorMsgType {
  _id: string;
  author: userInfoPanelType; // userId
  content: string;
  image: string;
  status: number;
  subject: string;
  hashTags: string[];
  collectionCount: number;
  shareCount: number;
  likedByUsers: string[];
  comments: string[];
  createdAt: string;
  editedAt: string;
}

/** post API參數型別 */
export interface PostVariablesType {
  postId?: string;
  userId: string; // author
  content: string;
  image?: string;
  status: number;
  hashTags?: string[];
}

export interface postResultType extends RqResponseType {
  data: PostDataType | null;
}
