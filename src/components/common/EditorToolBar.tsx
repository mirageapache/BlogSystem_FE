/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {
  faBold,
  faCode,
  faFont,
  faHighlighter,
  faItalic,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import EditorToolItem from 'components/common/EditorToolItem';

interface ToolBarPropsType {
  toggleInlineStyle: (style: string) => void;
}

function EditorToolBar({ toggleInlineStyle }: ToolBarPropsType) {
  const [showFontColor, setShowFontColor] = useState(false); // 顯示文字顏色選擇
  const [showBgColor, setShowBgColor] = useState(false); // 顯示標識顏色選擇

  const dropdownStyle =
    'absolute bg-white dark:bg-gray-900 z-40 w-[200px] shadow border border-gray-400 rounded-md p-1 text-gray-700 dark:text-gray-300';

  /** 處理文字顏色 dropdown 顯示 */
  const handleShowFontColor = (value: boolean) => {
    setShowFontColor(value);
  };

  return (
    <div className="flex h-10 mb-4 border-y-[1px] border-gray-300 dark:border-gray-700">
      {/* 粗體 */}
      <EditorToolItem
        text="bold"
        tipText="粗體"
        tipStyle="w-12"
        iconName={faBold}
        toggleInlineStyle={toggleInlineStyle}
      />
      {/* 斜體 */}
      <EditorToolItem
        text="italic"
        tipText="斜體"
        tipStyle="w-12"
        iconName={faItalic}
        toggleInlineStyle={toggleInlineStyle}
      />
      {/* 底線 */}
      <EditorToolItem
        text="underLine"
        tipText="底線"
        tipStyle="w-12"
        iconName={faUnderline}
        toggleInlineStyle={toggleInlineStyle}
      />
      {/* 刪除線 */}
      <EditorToolItem
        text="strikethrough"
        tipText="刪除線"
        tipStyle="w-12"
        iconName={faStrikethrough}
        toggleInlineStyle={toggleInlineStyle}
      />
      {/* 程式碼 */}
      <EditorToolItem
        text="code"
        tipText="程式碼"
        tipStyle="w-12"
        iconName={faCode}
        toggleInlineStyle={toggleInlineStyle}
      />
      {/* 文字顏色(text color) */}
      <div className="relative">
        <EditorToolItem
          text="textColor"
          tipText="文字顏色"
          tipStyle="w-16"
          iconName={faFont}
          handleShowFontColor={() => handleShowFontColor(!showFontColor)}
        />
        {showFontColor && (
          <div className="relative z-30">
            <div
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                handleShowFontColor(false);
              }}
            />
            <div className={dropdownStyle}>
              <EditorToolItem
                text="text-red"
                tipText="紅色"
                tipStyle="w-16"
                iconStyle="text-red-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
            </div>
          </div>
        )}
      </div>

      {/* 標識顏色(background color) */}
      <EditorToolItem
        text="highlight"
        tipText="標識顏色"
        tipStyle="w-16"
        iconName={faHighlighter}
        toggleInlineStyle={toggleInlineStyle}
      />
    </div>
  );
}

export default EditorToolBar;
