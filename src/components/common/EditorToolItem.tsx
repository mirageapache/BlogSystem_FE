import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { HINT_LABEL } from 'constants/LayoutConstants';

interface ToolItemPropsType {
  text: string;
  btnStyle?: string;
  tipText: string;
  tipStyle: string;
  iconName: IconDefinition; // 透過props傳遞icon名稱的寫法
  iconStyle?: string;
  handleShowFontColor?: () => void;
  handleShowBgColor?: () => void;
  toggleInlineStyle?: (style: string) => void;
}

function EditorToolItem({
  text,
  btnStyle,
  tipText,
  tipStyle,
  iconName,
  iconStyle,
  handleShowFontColor,
  handleShowBgColor,
  toggleInlineStyle,
}: ToolItemPropsType) {
  const [showTip, setShowTip] = useState(false);
  return (
    <button
      type="button"
      aria-label={text}
      className={`relative my-1 p-1 w-8 h-8 text-gray-500 ${text.substring(0,2) === 'bg'? '' : 'hover:text-orange-500'} hover:bg-sky-100 dark:hover:bg-sky-900 ${btnStyle}`}
      onClick={() => {
        if (toggleInlineStyle !== undefined) toggleInlineStyle(text.toUpperCase());
      }}
      onMouseDown={(e) => {
        e.preventDefault(); // 這個preventDefault()主要功能是防止選取文字的反白失焦(停留在反白效果的狀態)
        if (handleShowFontColor !== undefined) handleShowFontColor();
        if (handleShowBgColor !== undefined) handleShowBgColor();
      }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <FontAwesomeIcon icon={iconName} className={iconStyle} />
      <span
        className={`top-[-35px] left-[-8px] text-[13px] ${tipStyle} ${HINT_LABEL} ${showTip ? 'block' : 'hidden'}`}
      >
        {tipText}
      </span>
    </button>
  );
}

// 設定默認值
EditorToolItem.defaultProps = {
  btnStyle: '',
  iconStyle: '',
  handleShowFontColor: () => {},
  handleShowBgColor: () => {},
  toggleInlineStyle: () => {},
};

export default EditorToolItem;
