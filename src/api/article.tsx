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
        if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
        return error.response;
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
        if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
        return error.response;
      });
  }
  return result;
}

/** 新增文章 */
export async function createArticle(title: string, content: string): Promise<ArticleApiType> {
  const result = await axios
    .post(`${baseUrl}/article/create`, { title, content })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 編輯文章 */
export async function updateArticle(
  articleId: string,
  title: string,
  content: string
): Promise<ArticleApiType> {
  const result = await axios
    .patch(`${baseUrl}/article/update`, { articleId, title, content })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 刪除文章 */
export async function deleteArticle(articleId: string) {
  const config = {
    data: { articleId }, // 在 delete 請求中，必須在 config 裡加上 data
  };
  const result = await axios
    .delete(`${baseUrl}/article/delete`, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 喜歡/取消喜歡文章 */
export async function toggleLikeArticle(articleId: string, action: boolean) {
  const result = await axios
    .patch(`${baseUrl}/article/toggleLikeAction`, { articleId, action })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
