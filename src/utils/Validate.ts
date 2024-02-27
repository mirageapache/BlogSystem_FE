import { get } from 'lodash';
import validator from 'validator';

/**
 * 欄位必填檢核
 */
export const required = (errorMessage: string) => (value: string) =>
  value ? undefined : errorMessage || '該欄位必填';

/**
 * 最大值檢核
 */
export const maxLength = (max: number, msg: string) => (value: string) =>
  value.length > max ? msg : '';

/**
 * 長度檢核
 */
export const checkLength = (min: number, max: number, msg: string) => (value: string) =>
  value.length < min || value.length > max ? msg : '';

/**
 * 英、數字檢核
 */
export const onlyEngNum = (errorMessage: string) => (value: string) => {
  const regExp = /[^a-z^A-Z^0-9]/g;
  return (
    (value && !regExp.test(value)) ? (errorMessage || '限輸入英文字及數字') : undefined
  );
};

/**
 * 英文字檢核
 */
export const englishOnly = (errorMessage: string) => (value: string) => {
  const regExp = /^[a-zA-Z]+$/;
  return (
    (value && !regExp.test(value)) ? (errorMessage || '限輸入英文') : undefined
  );
};

/**
 * 數字檢核
 */
export const intOnly = (errorMessage: string) => (value: string) => {
  const regExp = /^[0-9]+$/;
  return (
    (value && !regExp.test(value)) ? (errorMessage || '請輸入數字') : undefined
  );
};

/** 
 * 確認密碼檢核
 */
export const passwordCheck = (value: string, allValues: unknown) => {
  if(get(allValues, 'password', null) !== get(allValues, 'confirmPassword', null)){
    return '密碼與確認密碼不相符';
  }
  return undefined;
}

/**
 * Email檢核
 */
export const isEmail = (errorMessage: string) => (value: string) => {
  if (!value) return undefined;

  return validator.isEmail(value) ? undefined : errorMessage;
};
