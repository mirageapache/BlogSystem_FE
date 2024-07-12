import axios from 'axios';
import { API_URL } from './index';
import { CommentDataType } from '../types/commentType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;
const authToken = localStorage.getItem('authToken');

/** commentApi 型別 */
interface CommentApiType extends AxResponseType {
  data: CommentDataType;
}

const config = {
  headers: { Authorization: `Bearer ${authToken}` },
};

/** 取得貼文留言 */
export async function getPostComment(): Promise<CommentApiType> {
  const result = await axios
    .get(`${baseUrl}/comment/`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 新增留言 */
export async function createComment(postId: string, userId: string, content: string): Promise<CommentApiType> {
  const result = await axios
    .post(`${baseUrl}/comment/create/${userId}`, { postId, userId, content }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 編輯留言 */
export async function updateComment(userId: string, formData: FormData): Promise<CommentApiType> {
  const result = await axios
    .patch(`${baseUrl}/comment/update/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
