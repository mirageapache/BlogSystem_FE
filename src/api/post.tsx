import axios from 'axios';
import { baseUrl } from './index';

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

export async function getTopTenPosts() {
  const result = await axios
    .get(`${baseUrl}/posts?limit=10`)
    .then((res) => {
      const postData = res.data;
      return postData;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}
