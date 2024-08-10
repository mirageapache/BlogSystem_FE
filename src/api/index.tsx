/* eslint-disable no-unused-vars */
const authToken = localStorage.getItem('authToken');
const localhost = 'http://localhost:3100'; // localhost
const renderServer = 'https://blogsystem-aakz.onrender.com'; // render server

/** 測試資料 dummyjson */
export const DUMMYJSON_URL = 'https://dummyjson.com';

/** base Url */
export const API_URL = localhost;

export const config = {
  headers: { Authorization: `Bearer ${authToken}` },
};
