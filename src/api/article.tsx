import axios from 'axios';
import { isEmpty, get } from 'lodash';
import { DUMMYJSON_URL } from './index';
import { ArticleListType } from '../types/articleType';
import { RqResponseType } from '../types/apiType';

const baseUrl = DUMMYJSON_URL;

/** aritcleApi 型別
 * 目前使用dummyjson的資料，所以建立這個型別(以符合資料結構)
 */
export interface AritcleApiType {
  post: ArticleListType[];
  total: number;
  skip: number;
  limit: number;
}

/** API Result 型別 */
export interface ApiResultType extends RqResponseType {
  data: AritcleApiType | null;
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
