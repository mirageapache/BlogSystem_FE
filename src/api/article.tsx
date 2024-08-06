import axios from 'axios';
import { isEmpty, get } from 'lodash';
import { API_URL, config } from './index';
import { ArticleDataType } from '../types/articleType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;

/** aritcleApi 型別
 * 目前使用dummyjson的資料，所以建立這個型別(以符合資料結構)
 */
// export interface AritcleApiType {
//   post: ArticleListType[];
//   total: number;
//   skip: number;
//   limit: number;
// }

/** article Result 型別 */
// export interface ArticleResultType extends RqResponseType {
//   data: AritcleApiType | null;
// }

interface ArticleApiType extends AxResponseType {
  data: ArticleDataType;
}

/** 取得所有文章 */
export async function getArticles() {
  const result = await axios
    .get(`${baseUrl}/article`)
    .then((res) => {
      console.log(res);
      const postData = res.data;
      return postData;
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
