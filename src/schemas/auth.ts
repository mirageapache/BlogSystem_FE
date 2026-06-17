import { z } from 'zod';

/**
 * 登入 / 註冊 / 找回密碼 / 重設密碼 的 zod 驗證 schema。
 * 取代原本散落於各元件與 utils/formValidates.ts 的手動驗證。
 * 錯誤訊息沿用舊版字串，避免變更使用者體驗與既有測試斷言。
 */

/** Email：必填 + 格式（先擋空字串再驗格式，兩段訊息語意清楚）
 * 註：刻意沿用 `.email()` 方法形式而非 v4 頂層 `z.email()`——後者會讓空字串
 * 直接觸發格式錯誤，無法保留「空值→必填、非空→格式」的分層訊息（亦對應測試斷言）。 */
const email = z.string().trim().min(1, 'Email為必填欄位').email('Email格式錯誤');

/** 密碼：必填 + 長度 6~20（上下界共用同一句長度提示，與舊版一致） */
const password = z
  .string()
  .min(1, '密碼為必填欄位')
  .min(6, '密碼長度須介於6至20字元')
  .max(20, '密碼長度須介於6至20字元');

/** 確認密碼欄位（一致性由物件層 refine 檢核） */
const confirmPassword = z.string().min(1, '確認密碼為必填欄位');

/** 登入 */
export const signInSchema = z.object({ email, password });
export type SignInFormType = z.infer<typeof signInSchema>;

/** 註冊 */
export const signUpSchema = z
  .object({ email, password, confirmPassword })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: '確認密碼與密碼不相符',
  });
export type SignUpFormType = z.infer<typeof signUpSchema>;

/** 找回密碼 */
export const findPwdSchema = z.object({ email });
export type FindPwdFormType = z.infer<typeof findPwdSchema>;

/** 重設密碼 */
export const resetPwdSchema = z
  .object({ password, confirmPassword })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: '確認密碼與密碼不相符',
  });
export type ResetPwdFormType = z.infer<typeof resetPwdSchema>;
