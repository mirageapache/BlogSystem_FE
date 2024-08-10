import axios from 'axios';
import { API_URL, config } from './index';
import { CommentDataType } from '../types/commentType';
import { AxResponseType } from '../types/apiType';

const baseUrl = API_URL;

/** commentApi 型別 */
interface CommentApiType extends AxResponseType {
  data: CommentDataType;
}

/** 取得貼文留言 */
export async function getComment(): Promise<CommentApiType> {
  const result = await axios
    .get(`${baseUrl}/comment/`)
    .then((res) => {
      const { data } = res.data;
      return data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 新增留言
 * @id 貼文或文章 id
 * @userId 使用者 id
 * @content 留言內容
 * @route 判斷post/article
 */
export async function createComment(
  id: string,
  userId: string,
  content: string,
  route: string
): Promise<CommentApiType> {
  const result = await axios
    .post(`${baseUrl}/comment/create/${userId}`, { id, userId, content, route }, config)
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
