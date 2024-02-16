import axios from 'axios';
import { DUMMYJSON_URL } from './index';

const baseUrl = DUMMYJSON_URL;

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
      const articleData = res.data;
      return articleData;
    })
    .catch((error) => {
      console.log(error);
    });
    return result;
}

