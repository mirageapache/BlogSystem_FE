import { isString } from 'lodash';

/**
 * 計算1天內時間差距(Calculate Time Difference)
 * @param currentTime 現在時間(時間戳)
 * @param inputTime 輸入時間(時間戳)
 */
export const calcTimeDiff = (currentTime: number, inputTime: number) => {
  const diff = Math.abs(currentTime - inputTime); // 計算秒數差距

  if (diff < 60 * 60) {
    // 不足1小時
    const minutes = Math.floor(diff / 60);
    if (minutes < 1) {
      return '剛剛';
    }
    return `${minutes} 分鐘前`;
  }
  if (diff < 60 * 60 * 24) {
    // 不足24小時
    const hours = Math.floor(diff / (60 * 60));
    return `${hours} 小時前`;
  }
  // 超過24小時
  return '1 天';
};

/**
 * 文章、貼文顯示日期時間轉換
 * @param datetime (時間戳)日期時間
 */
export const formatDateTime = (datetime: string) => {
  const currentDate = new Date();
  const inputDate = new Date(datetime);

  const diffDays = Math.abs(currentDate.getDate() - inputDate.getDate());

  if (inputDate.getFullYear() === currentDate.getFullYear()) {
    if (inputDate.getMonth() === currentDate.getMonth() && diffDays < 7) {
      if (diffDays > 1) {
        // 少於一週以天數顯示
        return `${diffDays}天`;
      }
      // 少於1天以小時顯示
      const currentTime = parseInt(currentDate.getTime().toString().substring(0, 10), 10);
      const inputTime = parseInt(inputDate.getTime().toString().substring(0, 10), 10);
      return calcTimeDiff(currentTime, inputTime);
    }
    return `${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
  }
  return `${inputDate.getFullYear()}年${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
};

/** 格式化 - 日期(不足10補0)
 * @param date
 */
export const formateDate = (dateParam: string | number) => {
  let date = dateParam;
  if (isString(date)) date = parseInt(date, 10);
  if (date < 10) {
    return `0${date.toString()}`;
  }
  return date.toString();
};

/** 格式化 - 月份(不足10補0)
 * @param month
 */
export const formateMonth = (monthParam: string | number) => {
  let month = monthParam;
  if (isString(month)) month = parseInt(month, 10);
  if (month < 10) {
    return `0${month.toString()}`;
  }
  return month.toString();
};
