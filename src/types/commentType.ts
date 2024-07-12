import { RqResponseType, errorMsgType } from './apiType';
import { UserInfoPanelType } from './userType';

/** comment API接收資料型別 */
export interface CommentDataType extends errorMsgType {
  _id: string;
  author: UserInfoPanelType; // userId
  replyTo: UserInfoPanelType;
  content: string;
  createdAt: string;
  editedAt: string;
}

/** post API參數型別 */
export interface PostVariablesType {
  postId?: string;
  userId: string; // author
  toUserId?: string; // replyTo userId
  content: string;
}

export interface postResultType extends RqResponseType {
  data: CommentDataType | null;
}
