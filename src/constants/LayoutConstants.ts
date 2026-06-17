/**
 * 定義通用的 style className
 */

// === 外框 ===
/** SideBar 外層section 樣式 */
export const SIDEBAR_FRAME = 'fixed hidden sm:block sm:w-20 lg:w-60 p-3 z-10';
/** BottomMenu 外層section 樣式 */
export const BOTTOM_MENU_FRAME =
  'fixed bottom-0 z-20 flex justify-center items-center w-full h-12 bg-paper/90 backdrop-blur sm:hidden border-t border-line';
/** Container 搭配 SideBar */
export const SIDEBAR_CONTAINER_FRAME =
  'relative w-full flex justify-center sm:ml-20 mb-12 sm:mb-0 lg:ml-60 px-1.5 sm:px-5 border-l border-line';
/** Full Container */
export const FULL_CONTAINER_FRAME = '';

// --- 元件 ---
/** Form Control 表單元件 */
export const FORM_CONTROL = 'w-full text-lg outline-none mt-2 px-2 py-1 focus:border-brand';

/** Gray Panel 灰底背景（Modal 遮罩，含淡入動畫） */
export const GRAY_BG_PANEL =
  'fixed inset-0 w-full h-full bg-ink/50 backdrop-blur-sm animate-overlay-in';

// === 按鈕語彙 ===
// 統一全站按鈕外觀；寬高／圓角由呼叫端決定（如 w-full rounded-lg、w-24 rounded-full）。
/** 主要按鈕：品牌實心，停用時退為次級填色 */
export const BTN_PRIMARY =
  'flex justify-center items-center font-medium text-white bg-brand hover:bg-brand-strong transition-colors disabled:bg-surface-2 disabled:text-muted disabled:cursor-not-allowed';
/** 次要按鈕：描邊低調，hover 轉品牌色 */
export const BTN_SECONDARY =
  'flex justify-center items-center font-medium text-ink bg-surface border border-line-strong hover:bg-surface-2 hover:border-brand transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
/** 文字連結按鈕：品牌色，無底 */
export const BTN_TEXT = 'font-medium text-brand hover:text-brand-strong transition-colors';

/** Tip Label 提示標籤 */
export const HINT_LABEL =
  'absolute text-center text-sm p-1 rounded-md bg-ink text-paper shadow-pop';

/** White Spacer 取消按鈕的背景偽元素（隨深淺模式切換底色） */
export const WHITE_SPACER =
  "after:content-[''] after:absolute after:text-red-500 after:border-8 after:rounded-md after:border-surface after:top-[-6px] after:right-[-6px]";
