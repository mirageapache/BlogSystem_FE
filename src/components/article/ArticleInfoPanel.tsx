import React from 'react';
// --- icon ---
import { ReactComponent as HeartIcon } from '../../assets/icons/heart.svg';
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg';

function ArticleInfoPanel() {
  return (
    <div className="py-2 mb-5 flex justify-between border-b-[1px] dark:border-gray-700">
      <div className="flex">
        <span className="mr-5 flex justify-center items-center cursor-pointer fill-gray-400 hover:fill-red-400">
          <HeartIcon className="w-6 h-6" />
          <p className="text-md pl-2 font-bold text-center text-gray-400 dark:text-gray-100">5</p>
        </span>
        <span className="flex justify-center items-center cursor-pointer fill-gray-400 hover:fill-amber-400">
          <CommentIcon className="w-6 h-6" />
          <p className="text-md pl-2 font-bold text-center text-gray-400 dark:text-gray-100">2</p>
        </span>
      </div>
      <div className="flex border border-red-500">right icon</div>
    </div>
  );
}

export default ArticleInfoPanel;
