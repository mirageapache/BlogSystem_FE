import axios from 'axios';
import { API_URL } from './index';
import { PostDataType } from '../types/postType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;
const limit = 5; // 每次取得資料數量

/** postApi 型別 */
interface PostApiType extends AxResponseType {
  data: PostDataType;
}

/** 動態取得貼文資料 型別 */
interface PostPageListType extends AxResponseType {
  posts: any;
  nextPage: number;
  data: PostDataType[];
}

/** 取得所有貼文 */
export async function getAllPosts(): Promise<PostApiType> {
  const result = await axios
    .get(`${baseUrl}/post/all`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** (動態)取得貼文資料
 * @param page 要取得的資料頁碼
 */
export async function getPartialPosts(page: number): Promise<PostPageListType> {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${baseUrl}/post/partial`, { page, limit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  }
  return result;
}

/** 取得搜尋貼文 or 特定使用者的貼文 */
export async function getSearchPost(
  searchString?: string,
  authorId?: string,
  page?: number
): Promise<PostPageListType> {
  let result = null;
  if (page && page > 0) {
    result = await axios
      .post(`${baseUrl}/post/search`, { searchString, authorId, page, limit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response;
      });
  }
  return result;
}

/** 取得特定貼文內容 */
export async function getPostDetail(postId: string): Promise<PostApiType> {
  const result = await axios
    .post(`${baseUrl}/post/detail`, { postId })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 新增貼文 */
export async function createPost(userId: string, formData: FormData): Promise<PostApiType> {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const result = await axios
    .post(`${baseUrl}/post/create/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 編輯貼文 */
export async function updatePost(userId: string, formData: FormData): Promise<PostApiType> {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const result = await axios
    .patch(`${baseUrl}/post/update/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 刪除貼文 */
export async function deletePost(postId: string, userId: string) {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    data: { postId }, // 在 delete 請求中，必須在 config 裡加上 data
  };
  const result = await axios
    .delete(`${baseUrl}/post/delete/${userId}`, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 喜歡/取消喜歡貼文 */
export async function toggleLikePost(postId: string, userId: string, action: boolean) {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  };
  const result = await axios
    .patch(`${baseUrl}/post/toggleLikeAction/${userId}`, { postId, userId, action }, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得搜尋hashTag(貼文) */
export async function getSearchHashTag(
  searchText: string,
  page: number
): Promise<PostPageListType> {
  const searchString = searchText.replace('#', '');
  const result = await axios
    .post(`${baseUrl}/post/hashTag`, { searchString, page, limit })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
