import axios from 'axios';
import { isEmpty, get } from 'lodash';
import { API_URL, config } from './index';
import { ArticleDataType } from '../types/articleType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;

interface ArticleApiType extends AxResponseType {
  data: ArticleDataType;
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

/** 取得部份文章 */
export async function getPartialArticles(limit: number) {
  const result = await axios
    .get(`${baseUrl}/posts?limit=${limit}`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得單一文章內容 */
export async function getArticleById<T>(id: T) {
  const result = await axios
    .get(`${baseUrl}/posts/${id}`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得單一使用者文章 */
export async function getArticleByUser<T>(id: T) {
  const result = await axios.get(`${baseUrl}/posts?user=${id}`).then((res) => {
    const postData = res.data;
    return postData;
  });
  return result;
}

/** 取得搜尋文章 */
export async function getSearchArticle(searchString: string) {
  const result = await axios
    .get(`${baseUrl}/posts/search?q=${searchString}`)
    .then((res) => {
      if (isEmpty(get(res, 'data.posts', []))) {
        return { mssage: '搜尋不到相關結果!!' };
      }
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 新增文章 */
export async function createArticle(userId: string, title: string, content: string): Promise<ArticleApiType> {
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
export async function updatePost(userId: string, title: string, content: string): Promise<ArticleApiType> {
  const variables = { userId, title, content };
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
