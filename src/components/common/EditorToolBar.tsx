/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  faBold,
  faCode,
  faFileCode,
  faFont,
  faHighlighter,
  faImage,
  faItalic,
  faListDots,
  faListNumeric,
  faQuoteLeft,
  faSquare,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import EditorToolItem from 'components/common/EditorToolItem';

interface ToolBarPropsType {
  editor: Editor | null;
}

/** 文字顏色面板（value 為 CSS 色值，null 代表清除回預設色） */
const TEXT_COLORS: {
  value: string | null;
  tip: string;
  tipStyle: string;
  iconStyle: string;
  btnStyle?: string;
}[] = [
  {
    value: null,
    tip: '預設',
    tipStyle: 'w-12',
    iconStyle: 'text-black',
    btnStyle: 'dark:bg-gray-700',
  },
  { value: '#374151', tip: '深灰色', tipStyle: 'w-14', iconStyle: 'text-gray-700' },
  { value: 'gray', tip: '灰色', tipStyle: 'w-12', iconStyle: 'text-gray-500' },
  { value: 'lightgray', tip: '淺灰色', tipStyle: 'w-14', iconStyle: 'text-gray-300' },
  {
    value: 'white',
    tip: '白色',
    tipStyle: 'w-12',
    iconStyle: 'text-white',
    btnStyle: 'bg-gray-200 dark:bg-inherit',
  },
  { value: 'red', tip: '紅色', tipStyle: 'w-12', iconStyle: 'text-red-500' },
  { value: 'orange', tip: '橙色', tipStyle: 'w-12', iconStyle: 'text-orange-500' },
  { value: 'yellow', tip: '黃色', tipStyle: 'w-12', iconStyle: 'text-yellow-500' },
  { value: 'green', tip: '綠色', tipStyle: 'w-12', iconStyle: 'text-green-500' },
  { value: 'blue', tip: '藍色', tipStyle: 'w-12', iconStyle: 'text-blue-500' },
  { value: 'indigo', tip: '靛藍色', tipStyle: 'w-14', iconStyle: 'text-indigo-500' },
  { value: 'purple', tip: '紫色', tipStyle: 'w-12', iconStyle: 'text-purple-500' },
];

/** 標示（highlight）顏色面板（value 為 CSS 色值，null 代表清除標示） */
const HIGHLIGHT_COLORS: {
  value: string | null;
  tip: string;
  tipStyle: string;
  iconStyle: string;
}[] = [
  {
    value: null,
    tip: '預設',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-transparent',
  },
  {
    value: '#9ca3af',
    tip: '灰色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-gray-500',
  },
  {
    value: '#f87171',
    tip: '紅色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-red-500',
  },
  {
    value: '#fb923c',
    tip: '橙色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-orange-500',
  },
  {
    value: '#fde047',
    tip: '黃色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-yellow-400',
  },
  {
    value: '#4ade80',
    tip: '綠色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-green-500',
  },
  {
    value: '#60a5fa',
    tip: '藍色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-blue-500',
  },
  {
    value: '#818cf8',
    tip: '靛藍色',
    tipStyle: 'w-14',
    iconStyle: 'border rounded-md w-6 h-6 text-indigo-500',
  },
  {
    value: '#c084fc',
    tip: '紫色',
    tipStyle: 'w-12',
    iconStyle: 'border rounded-md w-6 h-6 text-purple-500',
  },
];

/** 取得目前段落型別對應 select 的值 */
const getBlockValue = (editor: Editor) => {
  for (let level = 1; level <= 6; level += 1) {
    if (editor.isActive('heading', { level })) return `header-${level}`;
  }
  return 'unstyled';
};

function EditorToolBar({ editor }: ToolBarPropsType) {
  const [showFontColor, setShowFontColor] = useState(false); // 顯示文字顏色選擇
  const [showBgColor, setShowBgColor] = useState(false); // 顯示標示顏色選擇
  const imgUpload = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // 訂閱 editor 變動，使工具列的 active 狀態即時更新
  useEffect(() => {
    if (!editor) return undefined;
    const rerender = () => forceUpdate();
    editor.on('transaction', rerender);
    return () => {
      editor.off('transaction', rerender);
    };
  }, [editor]);

  const dropdownStyle =
    'fixed sm:absolute right-1 flex bg-white dark:bg-gray-900 z-40 shadow border border-gray-400 rounded-md p-1 text-gray-700 dark:text-gray-300';

  /** 處理scroll bar橫向捲動 */
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY * 0.2;
  };

  /** 設定段落型別（一般文字 / 標題一~六） */
  const handleBlockChange = (value: string) => {
    if (!editor) return;
    if (value === 'unstyled') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(value.replace('header-', '')) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  /** 設定文字顏色（null 清除回預設） */
  const handleTextColor = (value: string | null) => {
    if (!editor) return;
    if (value === null) editor.chain().focus().unsetColor().run();
    else editor.chain().focus().setColor(value).run();
    setShowFontColor(false);
  };

  /** 設定標示顏色（null 清除標示） */
  const handleHighlight = (value: string | null) => {
    if (!editor) return;
    if (value === null) editor.chain().focus().unsetHighlight().run();
    else editor.chain().focus().toggleHighlight({ color: value }).run();
    setShowBgColor(false);
  };

  /** 觸發上傳圖片並以 base64 內嵌 */
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (typeof src === 'string') editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // 允許重複選同一檔
  };

  if (!editor) return null;

  return (
    <div
      className="flex items-center min-h-10 mb-4 border-y-[1px] border-gray-300 dark:border-gray-700 overflow-x-auto"
      onWheel={handleWheel}
    >
      {/* 字體大小 */}
      <select
        name="fontSize"
        value={getBlockValue(editor)}
        className="h-8 my-1 mr-2 border border-gray-500 rounded-md px-3 bg-inherit dark:bg-gray-900 cursor-pointer"
        onChange={(e) => handleBlockChange(e.target.value)}
      >
        <option value="unstyled">一般文字</option>
        <option value="header-1">標題一</option>
        <option value="header-2">標題二</option>
        <option value="header-3">標題三</option>
        <option value="header-4">標題四</option>
        <option value="header-5">標題五</option>
        <option value="header-6">標題六</option>
      </select>
      {/* 粗體 */}
      <EditorToolItem
        ariaLabel="bold"
        tipText="粗體"
        tipStyle="w-12"
        iconName={faBold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      {/* 斜體 */}
      <EditorToolItem
        ariaLabel="italic"
        tipText="斜體"
        tipStyle="w-12"
        iconName={faItalic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      {/* 底線 */}
      <EditorToolItem
        ariaLabel="underline"
        tipText="底線"
        tipStyle="w-12"
        iconName={faUnderline}
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      {/* 刪除線 */}
      <EditorToolItem
        ariaLabel="strikethrough"
        tipText="刪除線"
        tipStyle="w-14"
        iconName={faStrikethrough}
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      {/* 程式碼 */}
      <EditorToolItem
        ariaLabel="code"
        tipText="程式碼"
        tipStyle="w-14"
        iconName={faCode}
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      {/* 文字顏色(text color) */}
      <div className="relative">
        <EditorToolItem
          ariaLabel="textColor"
          tipText="文字顏色"
          tipStyle="w-16"
          iconName={faFont}
          onClick={() => setShowFontColor((prev) => !prev)}
        />
        {showFontColor && (
          <div className="fixed z-30">
            <div
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                setShowFontColor(false);
              }}
            />
            <div className={`w-[210px] sm:left-0 flex-wrap ${dropdownStyle}`}>
              {TEXT_COLORS.map((c) => (
                <EditorToolItem
                  key={`text-${c.tip}`}
                  ariaLabel={`text-${c.value ?? 'default'}`}
                  btnStyle={c.btnStyle}
                  tipText={c.tip}
                  tipStyle={c.tipStyle}
                  iconStyle={c.iconStyle}
                  iconName={faFont}
                  onClick={() => handleTextColor(c.value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 標示顏色(background color) */}
      <div className="relative">
        <EditorToolItem
          ariaLabel="highlight"
          tipText="標示顏色"
          tipStyle="w-16"
          iconName={faHighlighter}
          onClick={() => setShowBgColor((prev) => !prev)}
        />
        {showBgColor && (
          <div className="fixed z-30">
            <div
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                setShowBgColor(false);
              }}
            />
            <div className={`w-[300px] sm:right-[-50px] sm:flex-wrap  ${dropdownStyle}`}>
              {HIGHLIGHT_COLORS.map((c) => (
                <EditorToolItem
                  key={`bg-${c.tip}`}
                  ariaLabel={`bg-${c.value ?? 'default'}`}
                  tipText={c.tip}
                  tipStyle={c.tipStyle}
                  iconStyle={c.iconStyle}
                  iconName={faSquare}
                  onClick={() => handleHighlight(c.value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 程式區塊 */}
      <EditorToolItem
        ariaLabel="code-block"
        tipText="程式區塊"
        tipStyle="w-16"
        iconName={faFileCode}
        iconStyle="w-5 h-5 mt-0.5"
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      {/* 引用 */}
      <EditorToolItem
        ariaLabel="blockquote"
        tipText="引用"
        tipStyle="w-12"
        iconName={faQuoteLeft}
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      {/* 項目清單 */}
      <EditorToolItem
        ariaLabel="unordered-list-item"
        tipText="項目清單"
        tipStyle="w-16"
        iconName={faListDots}
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      {/* 編號清單 */}
      <EditorToolItem
        ariaLabel="ordered-list-item"
        tipText="編號清單"
        tipStyle="w-16"
        iconName={faListNumeric}
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      {/* 插入圖片 */}
      <EditorToolItem
        ariaLabel="insert-image"
        tipText="插入圖片"
        tipStyle="w-16"
        iconName={faImage}
        iconStyle="w-5 h-5 mt-0.5"
        onClick={() => imgUpload.current?.click()}
      />
      <input
        ref={imgUpload}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
      />
    </div>
  );
}

export default EditorToolBar;
