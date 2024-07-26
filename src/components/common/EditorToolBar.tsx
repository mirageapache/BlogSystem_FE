/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {
  faBold,
  faCode,
  faFont,
  faHighlighter,
  faItalic,
  faSquare,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import EditorToolItem from 'components/common/EditorToolItem';

interface ToolBarPropsType {
  toggleInlineStyle: (style: string) => void;
}

function EditorToolBar({ toggleInlineStyle }: ToolBarPropsType) {
  const [showFontColor, setShowFontColor] = useState(false); // 顯示文字顏色選擇
  const [showBgColor, setShowBgColor] = useState(false); // 顯示標示顏色選擇

  const dropdownStyle =
    'absolute bg-white dark:bg-gray-900 z-40 w-[200px] shadow border border-gray-400 rounded-md p-1 text-gray-700 dark:text-gray-300';

  /** 處理文字顏色 dropdown 顯示 */
  const handleShowFontColor = (value: boolean) => {
    setShowFontColor(value);
  };

  /** 處理標示顏色 dropdown 顯示 */
  const handleShowBgColor = (value: boolean) => {
    setShowBgColor(value);
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
            <div className={`w-[210px] right-[-50px] sm:left-0 ${dropdownStyle}`}>
              <EditorToolItem
                text="text-black"
                btnStyle="dark:bg-gray-700"
                tipText="預設"
                tipStyle="w-12"
                iconStyle="text-black"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-deepgray"
                tipText="深灰色"
                tipStyle="w-14"
                iconStyle="text-gray-700"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-gray"
                tipText="灰色"
                tipStyle="w-12"
                iconStyle="text-gray-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-lightgray"
                tipText="淺灰色"
                tipStyle="w-14"
                iconStyle="text-gray-300"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-white"
                btnStyle="bg-gray-200 dark:bg-inherit"
                tipText="白色"
                tipStyle="w-12"
                iconStyle="text-white"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-red"
                tipText="紅色"
                tipStyle="w-12"
                iconStyle="text-red-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-orange"
                tipText="橙色"
                tipStyle="w-12"
                iconStyle="text-orange-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-yellow"
                tipText="黃色"
                tipStyle="w-12"
                iconStyle="text-yellow-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-green"
                tipText="綠色"
                tipStyle="w-12"
                iconStyle="text-green-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-blue"
                tipText="藍色"
                tipStyle="w-12"
                iconStyle="text-blue-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-indigo"
                tipText="靛藍色"
                tipStyle="w-14"
                iconStyle="text-indigo-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="text-purple"
                tipText="紫色"
                tipStyle="w-12"
                iconStyle="text-purple-500"
                iconName={faFont}
                toggleInlineStyle={toggleInlineStyle}
              />
            </div>
          </div>
        )}
      </div>

      {/* 標示顏色(background color) */}
      <div className="relative">
        <EditorToolItem
          text="highlight"
          tipText="標示顏色"
          tipStyle="w-16"
          iconName={faHighlighter}
          handleShowBgColor={() => handleShowBgColor(!showBgColor)}
        />
        {showBgColor && (
          <div className="relative z-30">
            <div
              className="fixed w-dvw h-dvh top-0 left-0"
              onClick={(e) => {
                e.preventDefault();
                handleShowBgColor(false);
              }}
            />
            <div className={`w-[300px] right-[-80px] sm:left-0 ${dropdownStyle}`}>
              <EditorToolItem
                text="bg-default"
                tipText="預設"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-white"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-gray"
                tipText="灰色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-gray-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-red"
                tipText="紅色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-red-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-orange"
                tipText="橙色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-orange-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-yellow"
                tipText="黃色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-yellow-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-green"
                tipText="綠色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-green-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-blue"
                tipText="藍色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-blue-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-indigo"
                tipText="靛藍色"
                tipStyle="w-14"
                iconStyle="border rounded-md w-6 h-6 text-indigo-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
              <EditorToolItem
                text="bg-purple"
                tipText="紫色"
                tipStyle="w-12"
                iconStyle="border rounded-md w-6 h-6 text-purple-500"
                iconName={faSquare}
                toggleInlineStyle={toggleInlineStyle}
              />
            </div>
          </div>
        )}
      </div>


    </div>
  );
}

export default EditorToolBar;
