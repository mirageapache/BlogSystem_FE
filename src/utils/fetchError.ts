import { get } from 'lodash';

interface DataType {
  id: number;
}

/**
 * 處理API回傳的錯誤訊息
 * @param fetchedData API response
 */
export const handleErrMsg = (fetchedData: DataType) => {
  let errorMsg: string = '';
  const apiStatus: number = get(fetchedData, 'response.status', 400);

  console.log(fetchedData);

  switch (apiStatus) {
    case 400:
      errorMsg = 'Bad Request';
      break;
    case 401:
      errorMsg = get(fetchedData, 'response.data.message', '發生錯誤，請稍後再試！');
      break;
    case 403:
      // errorMsg = 'Forbidden';
      break;
    case 404:
      errorMsg = 'Not Found';
      break;
    case 405:
      // errorMsg = 'Method Not Allowed';
      break;
    case 408:
      // errorMsg = 'Request Timeout';
      break;
    case 500:
      errorMsg = '遠端伺服器錯誤，請稍後再試！';
      break;
    case 501:
      // errorMsg = 'Not Implemented';
      break;
    case 502:
      // errorMsg = 'Bad Gateway';
      break;
    case 503:
      // errorMsg = 'Service Unavailable';
      break;
    case 504:
      // errorMsg = 'Gateway Timeout';
      break;
    default:
      errorMsg = '發生錯誤，請稍後再試！';
  }

  return errorMsg;
};
