import { z } from 'zod';

/**
 * 編輯個人資料（EditProfilePage）的 zod 驗證 schema。
 * 取代原本散落於 submitEditProfile 的手動 isEmpty / length 檢核。
 * 錯誤訊息沿用舊版字串，避免變更使用者體驗。
 */
export const editProfileSchema = z.object({
  /** 電子郵件：必填 + 格式（原本僅檢核必填，順手補上格式驗證） */
  email: z.string().trim().min(1, 'Email欄位必填').email('Email格式錯誤'),
  /** 帳號：必填 */
  account: z.string().trim().min(1, '帳號欄位必填'),
  /** 名稱：必填 */
  name: z.string().trim().min(1, '名稱欄位必填'),
  /** 自我介紹：最多 200 字（可留空） */
  bio: z.string().max(200, '自我介紹最多200字'),
  /** 系統語言：zh / en */
  language: z.string(),
  /** Email 通知推播 */
  emailPrompt: z.boolean(),
  /** 手機通知推播 */
  mobilePrompt: z.boolean(),
});
export type EditProfileFormType = z.infer<typeof editProfileSchema>;
