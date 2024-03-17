import axios from 'axios';
import { isEmpty, get } from 'lodash';
import { DUMMYJSON_URL } from './index';

const baseUrl = DUMMYJSON_URL;

/** articleList 型別 */
export interface articleListType {
  body: string;
  id: number;
  reactions: number;
  tags: [string];
  title: string;
  userId: number;
}

/** aritcleApi 型別 */
export interface aritcleApiType {
  post: [articleListType];
  total: number;
  skip: number;
  limit: number;
}

/** API Result 型別 */
export interface apiResultType {
  isLoading: boolean;
  error: { message: string } | null;
  data: aritcleApiType | unknown;
}

/** 取得所有文章 */
export async function getArticles() {
  const result = await axios
    .get(`${baseUrl}/posts`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    });
  return result;
}
