import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  faBold,
  faCode,
  faEraser,
  faFont,
  faHighlighter,
  faItalic,
  faListDots,
  faListNumeric,
  faQuoteLeft,
  faSquare,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { faFileCode } from '@fortawesome/free-regular-svg-icons';
import Underline from '@tiptap/extension-underline';
import EditorToolItem from 'components/common/EditorToolItem';

interface TiptapToolBarProps {
  editor: Editor | null;
}

function TiptapToolBar({ editor }: TiptapToolBarProps) {
  const [showFontColor, setShowFontColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  Underline.configure({
    HTMLAttributes: {
      class: 'text-gray-500',
    },
  });

  const dropdownStyle =
    'fixed sm:absolute right-1 flex bg-white dark:bg-gray-900 z-40 shadow border border-gray-400 rounded-md p-1 text-gray-700 dark:text-gray-300';

  const handleShowFontColor = (value: boolean) => {
    setShowFontColor(value);
  };

  const handleShowBgColor = (value: boolean) => {
    setShowBgColor(value);
  };

  const handleWheel = (event: any) => {
    event.preventDefault();
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY * 0.2;
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      className="flex items-center min-h-10 mb-4 border-y-[1px] border-gray-300 dark:border-gray-700 overflow-x-auto"
      onWheel={handleWheel}
    >
      {/* 字體大小 */}
      <select
        name="fontSize"
        className="h-8 my-1 mr-2 border border-gray-500 rounded-md px-3 bg-inherit dark:bg-gray-900 cursor-pointer"
        onChange={(e) => {
          const level = parseInt(e.target.value, 10);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
              .run();
          }
        }}
      >
        <option value="0">一般文字</option>
        <option value="1">標題一</option>
        <option value="2">標題二</option>
        <option value="3">標題三</option>
        <option value="4">標題四</option>
        <option value="5">標題五</option>
        <option value="6">標題六</option>
      </select>

      {/* 粗體 */}
      <EditorToolItem
        text="bold"
        tipText="粗體"
        tipStyle="w-12"
        iconName={faBold}
        handleTipTap={() => editor.chain().focus().toggleBold().run()}
        isTiptap
      />

      {/* 斜體 */}
      <EditorToolItem
        text="italic"
        tipText="斜體"
        tipStyle="w-12"
        iconName={faItalic}
        handleTipTap={() => editor.chain().focus().toggleItalic().run()}
        isTiptap
      />

      {/* 底線 */}
      {/* <EditorToolItem
        text="underline"
        tipText="底線"
        tipStyle="w-12"
        iconName={faUnderline}
        handleTipTap={() => editor.chain().focus().toggleUnderline().run()}
        isTiptap
      /> */}

      {/* 刪除線 */}
      <EditorToolItem
        text="strike"
        tipText="刪除線"
        tipStyle="w-14"
        iconName={faStrikethrough}
        handleTipTap={() => editor.chain().focus().toggleStrike().run()}
        isTiptap
      />

      {/* 程式碼 */}
      <EditorToolItem
        text="code"
        tipText="程式碼"
        tipStyle="w-14"
        iconName={faCode}
        handleTipTap={() => editor.chain().focus().toggleCode().run()}
        isTiptap
      />

      {/* 清除格式 */}
      <EditorToolItem
        text="clear-format"
        tipText="清除格式"
        tipStyle="w-14"
        iconName={faEraser}
        handleTipTap={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        isTiptap
      />

      {/* 文字顏色 */}
      <div className="relative">
        <EditorToolItem
          text="textColor"
          tipText="文字顏色"
          tipStyle="w-16"
          iconName={faFont}
          handleTipTap={() => handleShowFontColor(!showFontColor)}
          isTiptap
        />
        {showFontColor && (
          <div className="fixed z-30">
            <button
              type="button"
              aria-label="close"
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                handleShowFontColor(false);
              }}
            />
            <div className={`w-[210px] sm:left-0 flex-wrap ${dropdownStyle}`}>
              <EditorToolItem
                text="text-black"
                tipText="預設"
                tipStyle="w-12"
                iconStyle="text-black dark:text-white"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().unsetColor().run()}
                isTiptap
              />
              <EditorToolItem
                text="text-red"
                tipText="紅色"
                tipStyle="w-12"
                iconStyle="text-red-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#ef4444').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-orange"
                tipText="橙色"
                tipStyle="w-12"
                iconStyle="text-orange-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#f97316').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-yellow"
                tipText="黃色"
                tipStyle="w-12"
                iconStyle="text-yellow-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#eab308').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-green"
                tipText="綠色"
                tipStyle="w-12"
                iconStyle="text-green-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#22c55e').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-blue"
                tipText="藍色"
                tipStyle="w-12"
                iconStyle="text-blue-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#3b82f6').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-indigo"
                tipText="靛藍色"
                tipStyle="w-14"
                iconStyle="text-indigo-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#6366f1').run()}
                isTiptap
              />
              <EditorToolItem
                text="text-purple"
                tipText="紫色"
                tipStyle="w-12"
                iconStyle="text-purple-500"
                iconName={faFont}
                handleTipTap={() => editor.chain().focus().setColor('#a855f7').run()}
                isTiptap
              />
            </div>
          </div>
        )}
      </div>

      {/* 標示顏色 */}
      <div className="relative">
        <EditorToolItem
          text="highlight"
          tipText="標示顏色"
          tipStyle="w-16"
          iconName={faHighlighter}
          handleTipTap={() => handleShowBgColor(!showBgColor)}
          isTiptap
        />
        {showBgColor && (
          <div className="fixed z-30">
            <button
              type="button"
              aria-label="close"
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                handleShowBgColor(false);
              }}
            />
            <div className={`w-[300px] sm:right-[-50px] sm:flex-wrap ${dropdownStyle}`}>
              <EditorToolItem
                text="bg-yellow"
                tipText="黃色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-yellow-400"
                iconName={faSquare}
                handleTipTap={() => editor.chain().focus().setHighlight({ color: '#facc15' }).run()}
                isTiptap
              />
              <EditorToolItem
                text="bg-green"
                tipText="綠色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-green-500"
                iconName={faSquare}
                handleTipTap={() => editor.chain().focus().setHighlight({ color: '#22c55e' }).run()}
                isTiptap
              />
              <EditorToolItem
                text="bg-blue"
                tipText="藍色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-blue-500"
                iconName={faSquare}
                handleTipTap={() => editor.chain().focus().setHighlight({ color: '#3b82f6' }).run()}
                isTiptap
              />
              <EditorToolItem
                text="bg-purple"
                tipText="紫色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-purple-500"
                iconName={faSquare}
                handleTipTap={() => editor.chain().focus().setHighlight({ color: '#a855f7' }).run()}
                isTiptap
              />
            </div>
          </div>
        )}
      </div>

      {/* 程式區塊 */}
      <EditorToolItem
        text="code-block"
        tipText="程式區塊"
        tipStyle="w-16"
        iconName={faFileCode}
        iconStyle="w-5 h-5 mt-0.5"
        handleTipTap={() => editor.chain().focus().toggleCodeBlock().run()}
        isTiptap
      />

      {/* 引用 */}
      <EditorToolItem
        text="blockquote"
        tipText="引用"
        tipStyle="w-12"
        iconName={faQuoteLeft}
        handleTipTap={() => editor.chain().focus().toggleBlockquote().run()}
        isTiptap
      />

      {/* 項目清單 */}
      <EditorToolItem
        text="bullet-list"
        tipText="項目清單"
        tipStyle="w-16"
        iconName={faListDots}
        handleTipTap={() => editor.chain().focus().toggleBulletList().run()}
        isTiptap
      />

      {/* 編號清單 */}
      <EditorToolItem
        text="ordered-list"
        tipText="編號清單"
        tipStyle="w-16"
        iconName={faListNumeric}
        handleTipTap={() => editor.chain().focus().toggleOrderedList().run()}
        isTiptap
      />
    </div>
  );
}

export default TiptapToolBar;
