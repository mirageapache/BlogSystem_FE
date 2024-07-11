import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

function ArticleInfoPanel() {
  return (
    <div className="py-2 mb-5 flex justify-between border-b-[1px] dark:border-gray-700">
      <div className="flex">
        {/* 喜歡 */}
        <span className="mr-5 flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'heart', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-red-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">5</p>
        </span>
        {/* 留言 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'comment', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-green-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">2</p>
        </span>
      </div>
      <div className="flex gap-5">
        {/* 閱讀時間 */}
        <span className="hidden md:flex justify-center items-center text-gray-400 dark:text-gray-100 cursor-default">
          閱讀時間：5分鐘
        </span>
        {/* 分享 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'share-from-square', style: 'solid' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
        </span>
        {/* 收藏 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'bookmark', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
        </span>
      </div>
    </div>
  );
}

export default ArticleInfoPanel;
