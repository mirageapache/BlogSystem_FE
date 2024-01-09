import axios from 'axios';
import { DUMMYJSON_URL } from './index';

const baseUrl = DUMMYJSON_URL;

export async function getPosts() {
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

export async function getPostByLimit(limit: number) {
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
