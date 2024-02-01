/**
 * 日期、時間轉換運算
 */

/**
 * 文章、貼文顯示日期轉換
 * @param date 日期
 * @param time 時間
 */
export const formatDate = (date: string) => {
  const now = new Date();
  const currentTime = now.getTime();
  const currentDate = now
  const inputDate = new Date(
    parseInt(date.substring(0, 4), 10),
    parseInt(date.substring(4, 6), 10) - 1,
    parseInt(date.substring(6, 8), 10)
  );
  
  console.log(currentDate, currentTime); // Thu Feb 01 2024 17:20:25 GMT+0800 (台北標準時間) 1706779225567
  // 1 1706779069272

  const diffTime = Math.abs(currentDate.getDate() - inputDate.getDate());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    if(diffDays <= 0){
      return '今天';
    }
    else {
      return `${diffDays}天`;
    }
  } else {
    if (inputDate.getFullYear() === currentDate.getFullYear()) {
      return `${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
    } else {
      return `${inputDate.getFullYear()}年${inputDate.getMonth() + 1}月${inputDate.getDate()}日`;
    }
  }
};

