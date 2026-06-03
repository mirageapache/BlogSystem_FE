/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { HINT_LABEL } from 'constants/LayoutConstants';

/** 編輯器工具列按鈕（呈現型元件）
 * 改為 Tiptap 相容：點擊行為由父層以 onClick 傳入（內部呼叫 editor 命令），
 * 是否啟用（active）由 isActive 控制樣式。 */
interface ToolItemPropsType {
  ariaLabel: string;
  tipText: string;
  tipStyle: string;
  iconName: IconDefinition;
  iconStyle?: string;
  btnStyle?: string;
  isActive?: boolean;
  onClick: () => void;
}

function EditorToolItem({
  ariaLabel,
  tipText,
  tipStyle,
  iconName,
  iconStyle = '',
  btnStyle = '',
  isActive = false,
  onClick,
}: ToolItemPropsType) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative block min-w-8 min-h-8">
      <div className="sm:fixed z-10">
        <button
          type="button"
          aria-label={ariaLabel}
          aria-pressed={isActive}
          className={`p-1 min-w-8 h-8 ${
            isActive ? 'text-orange-500 bg-sky-100 dark:bg-sky-900' : 'text-gray-500'
          } ${ariaLabel.substring(0, 2) === 'bg' ? '' : 'hover:text-orange-500'} hover:bg-sky-100 dark:hover:bg-sky-900 ${btnStyle}`}
          onMouseDown={(e) => {
            // 防止點擊工具列時編輯區反白失焦
            e.preventDefault();
            onClick();
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
      </div>
    </div>
  );
}

export default EditorToolItem;
