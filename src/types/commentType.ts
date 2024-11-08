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

export interface PostResultType extends RqResponseType {
  data: CommentDataType | null;
}
