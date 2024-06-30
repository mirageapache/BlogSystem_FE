import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { IconName, IconStyle } from '@fortawesome/fontawesome-svg-core';

interface PropsType {
  iconName: IconName; // fontAwesome icon name
  iconStyle: IconStyle; // fontAwesome icon style
  tipText: string; // 提示內容
  handleClick: () => void;
}

function PostInfoItem(props: PropsType) {
  const { iconName, iconStyle, tipText, handleClick } = props;
  const [showTip, setShowTip] = useState(false);
  console.log(iconName, iconStyle);

  return (
    <div>
      <span
        className="relative"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <button
          type="button"
          className="flex justify-center items-center text-gray-500 hover:text-orange-500"
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={icon({ name: iconName, style: iconStyle })}
            className="w-5 h-5 m-1.5"
          />
        </button>
        <span
          className={`absolute top-[-25px] right-0 w-20 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
            showTip ? 'block' : 'hidden'
          }`}
        >
          {tipText}
        </span>
      </span>
    </div>
  );
}

export default PostInfoItem;
