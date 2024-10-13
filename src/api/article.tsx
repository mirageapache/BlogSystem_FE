import axios from 'axios';
import { API_URL } from './index';
import { ArticleDataType } from '../types/articleType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;
const limit = 5; // 每次取得資料數量

/** AritlceApi 型別 */
interface ArticleApiType extends AxResponseType {
  data: ArticleDataType;
}

/** 動態取得文章資料 型別 */
interface ArticlePageListType extends AxResponseType {
  articles: any;
  nextPage: number;
  data: ArticleDataType[];
}

/** 取得所有文章 */
export async function getArticles(): Promise<ArticleApiType> {
  const result = await axios
    .get(`${baseUrl}/article`)
    .then((res) => {
      const articleData = res.data;
      return articleData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** (動態)取得文章資料
 * @param page 要取得的資料頁碼
 */
export async function getPartialArticles(page: number): Promise<ArticlePageListType> {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${baseUrl}/article/partial`, { page, limit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  }
  return result;
}

/** 取得特定文章內容 */
export async function getArticleDetail(articleId: string): Promise<ArticleApiType> {
  const result = await axios
    .post(`${baseUrl}/article/detail`, { articleId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得搜尋文章 or 特定使用者的文章 */
export async function getSearchArticle(
  searchString?: string,
  authorId?: string,
  page?: number
): Promise<ArticlePageListType> {
  let result = null;
  if (page && page > 0) {
    result = await axios
      .post(`${baseUrl}/article/search`, { searchString, authorId, page, limit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response;
      });
  }
  return result;
}

/** 新增文章 */
export async function createArticle(
  userId: string,
  title: string,
  content: string
): Promise<ArticleApiType> {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const variables = { userId, title, content };
  const result = await axios
    .post(`${baseUrl}/article/create/${userId}`, variables, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 編輯文章 */
export async function updateArticle(
  articleId: string,
  userId: string,
  title: string,
  content: string
): Promise<ArticleApiType> {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const variables = { articleId, userId, title, content };
  const result = await axios
    .patch(`${baseUrl}/article/update/${userId}`, variables, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 喜歡/取消喜歡文章 */
export async function toggleLikeArticle(articleId: string, userId: string, action: boolean) {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const result = await axios
    .patch(`${baseUrl}/article/toggleLikeAction/${userId}`, { articleId, userId, action }, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
