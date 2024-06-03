import axios from 'axios';
import { DUMMYJSON_URL } from './index';
import { PostVariablesType } from 'types/postType';

const baseUrl = DUMMYJSON_URL;

/** 取得所有貼文 */
export async function getAllPosts() {
  const result = await axios
    .get(`${baseUrl}/post/all`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}


/** 取得特定貼文內容 */
export async function getPosDetail(postId: string) {
  const result = await axios
    .post(`${baseUrl}/post/detail`, { postId })
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

/** 新增貼文 */
export async function createPost(variables: PostVariablesType) {
  console.log(variables);

  const result = await axios
    .post(`${baseUrl}/post/create`, variables)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

/** 編輯貼文 */
export async function updatePost(variables: PostVariablesType){
  console.log(variables);

  const result = await axios
    .patch(`${baseUrl}/post/update`, variables)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

/** 喜歡/取消喜歡貼文 */
export async function handleLikePost(postId: string, userId: string, action: string){
  console.log(postId, userId, action);

  const result = await axios
    .patch(`${baseUrl}/post/like`, {postId, userId, action})
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}