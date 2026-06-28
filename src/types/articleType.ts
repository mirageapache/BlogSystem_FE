import { RqResponseType, errorMsgType } from './apiType';
import { UserInfoPanelType } from './userType';

export interface ArticleDataType extends errorMsgType {
  _id: string;
  author: UserInfoPanelType;
  title: string;
  content: string;
  image: string;
  status: number;
  hashTags: string[];
  collectionCount: number;
  shareCount: number;
  likedByUsers: UserInfoPanelType[];
  comments: string[];
  createdAt: string;
  editedAt: string;
}

export interface ArticleVariablesType {
  articleId?: string;
  userId: string;
  content: string;
  image?: string;
  status: number;
  hashTags?: string[];
}

export interface ArticleResultType extends RqResponseType {
  data: ArticleDataType | null;
}

export interface MyArticleListType {
  articles: ArticleDataType[];
  nextPage: number;
  totalArticle: number;
}
