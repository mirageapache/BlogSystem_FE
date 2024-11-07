import { RqResponseType, errorMsgType } from './apiType';
import { UserInfoPanelType } from './userType';

/** article API接收資料型別 */
export interface ArticleDataType extends errorMsgType {
  _id: string;
  author: UserInfoPanelType; // userId
  title: string;
  content: string;
  image: string;
  status: number;
  subject: string;
  hashTags: string[];
  collectionCount: number;
  shareCount: number;
  likedByUsers: UserInfoPanelType[];
  comments: string[];
  createdAt: string;
  editedAt: string;
}

/** article API參數型別 */
export interface ArticleVariablesType {
  articleId?: string;
  userId: string; // author
  content: string;
  image?: string;
  status: number;
  hashTags?: string[];
}

export interface ArticleResultType extends RqResponseType {
  data: ArticleDataType | null;
}
