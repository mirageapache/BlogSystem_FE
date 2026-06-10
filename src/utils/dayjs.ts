// 集中設定 dayjs（取代 moment）。
// advancedFormat plugin 提供 `Do`（序數日，如 2nd）等進階格式 token，
// 對應原本 moment 的 'MMMM Do YYYY, h:mm:ss' 顯示格式。
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export default dayjs;
