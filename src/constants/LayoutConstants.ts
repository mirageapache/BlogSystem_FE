/**
 * 定義通用的 style className
 */

// === 外框 ===
/** SideBar 外層section 樣式 */
export const SIDEBAR_FRAME = 'fixed hidden sm:block sm:w-20 lg:w-60 p-3 z-10';
/** BottomMenu 外層section 樣式 */
export const BOTTOM_MENU_FRAME =
  'fixed bottom-0 flex justify-center items-center w-full h-12 bg-white dark:bg-gray-950 sm:hidden border-gray-200 dark:border-gray-700 border-t-[1px]';
/** Container 搭配 SideBar */
export const SIDEBAR_CONTAINER_FRAME =
  'relative w-full flex justify-center sm:ml-20 mb-12 sm:mb-0 lg:ml-60 px-1.5 sm:px-5 border-l-[1px] border-gray-200 dark:border-gray-700';
/** Full Container */
export const FULL_CONTAINER_FRAME = '';

// --- 元件 ---
/** Form Control 表單元件 */
export const FORM_CONTROL = 'w-full text-lg outline-none mt-2 px-2 py-1 focus:border-blue-500';

/** Gray Panel 灰底背景 */
export const GRAY_BG_PANEL = 'fixed w-full h-full bg-black opacity-40';

/** Tip Label 提示標籤 */
export const HINT_LABEL =
  'absolute text-center text-sm p-1 rounded-md opacity-90 bg-black text-white dark:bg-white dark:text-black';

/** White Spacer 取消按鈕的白色背景偽元素   */
export const WHITE_SPACER =
  "after:content-[''] after:absolute after:text-red-500 after:border-8 after:rounded-md after:border-white after:top-[-6px] after:right-[-6px]";
