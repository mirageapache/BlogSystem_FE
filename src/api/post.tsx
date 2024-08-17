import axios from 'axios';
import { API_URL, config } from './index';
import { PostDataType } from '../types/postType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;

/** postApi 型別 */
interface PostApiType extends AxResponseType {
  data: PostDataType;
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

/** 取得搜尋貼文 */
export async function getSearchPost(searchString: string, authorId: string): Promise<PostApiType> {
  const result = await axios
    .post(`${baseUrl}/post/search`, { searchString, authorId })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
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
  const result = await axios
    .post(`${baseUrl}/post/create/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 編輯貼文 */
export async function updatePost(userId: string, formData: FormData): Promise<PostApiType> {
  const result = await axios
    .patch(`${baseUrl}/post/update/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 喜歡/取消喜歡貼文 */
export async function toggleLikePost(postId: string, userId: string, action: boolean) {
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
