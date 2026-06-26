import axios from 'axios';
import { API_URL } from './index';
import { ArticleDataType, MyArticleListType } from '../types/articleType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;
const limit = 5;

interface ArticleApiType extends AxResponseType {
  data: ArticleDataType;
}

interface ArticlePageListType extends AxResponseType {
  articles: ArticleDataType[];
  nextPage: number;
  data: ArticleDataType[];
}

/** (動態)取得文章資料 */
export async function getPartialArticles(page: number): Promise<ArticlePageListType | null> {
  if (page <= 0) return null;
  return axios
    .post(`${baseUrl}/article/partial`, { page, limit })
    .then((res) => res.data)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}

/** 取得特定文章內容 */
export async function getArticleDetail(articleId: string): Promise<ArticleApiType> {
  return axios
    .post(`${baseUrl}/article/detail`, { articleId })
    .then((res) => res)
    .catch((error) => error.response);
}

/** 取得搜尋文章 or 特定使用者的文章（僅回傳公開/限閱，草稿不在其中） */
export async function getSearchArticle(
  searchString?: string,
  authorId?: string,
  page?: number
): Promise<ArticlePageListType | null> {
  if (!page || page <= 0) return null;
  return axios
    .post(`${baseUrl}/article/search`, { searchString, authorId, page, limit })
    .then((res) => res.data)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}

/** 新增文章（草稿或發佈） */
export async function createArticle(
  title: string,
  content: string,
  status: number
): Promise<ArticleApiType> {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('content', content);
  fd.append('status', String(status));
  return axios
    .post(`${baseUrl}/article/create`, fd)
    .then((res) => res)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}

/** 編輯文章；status 未帶時後端維持原狀態不變 */
export async function updateArticle(
  articleId: string,
  title: string,
  content: string,
  status?: number
): Promise<ArticleApiType> {
  const fd = new FormData();
  fd.append('articleId', articleId);
  fd.append('title', title);
  fd.append('content', content);
  if (status !== undefined) fd.append('status', String(status));
  return axios
    .patch(`${baseUrl}/article/update`, fd)
    .then((res) => res)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}

/** 刪除文章 */
export async function deleteArticle(articleId: string) {
  return axios
    .delete(`${baseUrl}/article/delete`, { data: { articleId } })
    .then((res) => res)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}

/** 喜歡/取消喜歡文章 */
export async function toggleLikeArticle(articleId: string, action: boolean) {
  return axios
    .patch(`${baseUrl}/article/toggleLikeAction`, { articleId, action })
    .then((res) => res.data)
    .catch((error) => error.response);
}

/** 取得登入者本人的所有文章（含草稿、下架） */
export async function getMyArticleList(
  page: number,
  pageLimit?: number,
  status?: number
): Promise<MyArticleListType | null> {
  if (page <= 0) return null;
  const body: Record<string, number> = { page, limit: pageLimit ?? 20 };
  if (status !== undefined) body.status = status;
  return axios
    .post(`${baseUrl}/article/myList`, body)
    .then((res) => res.data)
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
}
