/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { isEmpty } from 'lodash';

interface PropsType {
  iconName: IconDefinition; // 透過props傳遞icon名稱的寫法
  count: number | undefined; // 選項數量
  tipText: string; // 提示內容
  faClass: string; // icon class樣式
  handleClick: () => void;
}

function PostInfoItem(props: PropsType) {
  const { iconName, count, tipText, faClass, handleClick } = props;
  const [showTip, setShowTip] = useState(false);

  return (
    <div>
      <span
        className="relative flex justify-center items-center"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <button
          type="button"
          className={`flex justify-center items-center ${faClass}`}
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={iconName}
            className="w-5 h-5 m-1.5"
          />
        </button>
        {!isEmpty(count) || count !== undefined && 
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">{count}</p>
        }
        <span
          className={`absolute top-[-25px] right-0 w-12 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
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
