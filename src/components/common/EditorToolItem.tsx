import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { HINT_LABEL } from 'constants/LayoutConstants';

interface ToolItemPropsType {
  text: string;
  tipText: string;
  tipStyle: string;
  iconStyle?: string;
  iconName: IconDefinition; // 透過props傳遞icon名稱的寫法
  handleShowFontColor?: () => void;
  toggleInlineStyle?: (style: string) => void;
}

function EditorToolItem({
  text,
  tipText,
  tipStyle,
  iconStyle,
  iconName,
  handleShowFontColor,
  toggleInlineStyle,
}: ToolItemPropsType) {
  const [showTip, setShowTip] = useState(false);
  return (
    <button
      type="button"
      aria-label={text}
      className="relative my-1 p-1 w-8 h-8 text-gray-500 hover:text-orange-500 hover:bg-gray-300"
      onClick={(e) => {
        e.preventDefault();
        if (handleShowFontColor !== undefined) handleShowFontColor();
        if (toggleInlineStyle !== undefined) toggleInlineStyle(text.toUpperCase());
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
  iconStyle: '',
  handleShowFontColor: () => {},
  toggleInlineStyle: () => {},
};

export default EditorToolItem;
