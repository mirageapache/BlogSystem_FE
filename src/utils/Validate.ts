

/**
 * 欄位必填檢核
 * @param {*} errorMessage 錯誤訊息
 */
export const required = (errorMessage: string) => (value: string | number) => (value ? undefined : (errorMessage || '該欄位必填!'));

/**
 * 最大值檢核
 * @param {*} max 最大值
 * @param {*} msg 錯誤訊息
 */
export const maxLength = (max: number, msg: string) => (value: string) => (value.length < max || value.length > max ? msg : '');

/**
 * 長度檢核
 * @param {*} min 最小值
 * @param {*} max 最大值
 * @param {*} msg 錯誤訊息
 */
export const checkLength = (min: number, max: number, msg: string) => (value: string) => ((value.length < min || value.length > max) ? msg : '');

/**
 * 12碼英數檢核
 */
export const onlyEngNum = (value: string) => value.replace(/[^\d|a-zA-Z]/g, '').slice(0, 12);