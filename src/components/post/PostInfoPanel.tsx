import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { PostDataType } from 'types/postType';

function PostInfoPanel(props: { postData: PostDataType }) {
  const { postData } = props;
  const likeCount = postData.likedByUsers.length; // 喜歡數
  const commentCount = postData.comments.length; // 留言數

  return (
    <div className="flex justify-between">
      <div className="flex">
        {/* 喜歡 */}
        <span className="mr-5 flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'heart', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-red-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">
            {likeCount}
          </p>
        </span>
        {/* 留言 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'comment', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-green-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">
            {commentCount}
          </p>
        </span>
      </div>
      <div className="flex gap-5">
        {/* 分享 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'share', style: 'solid' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">
            {postData.shareCount !== 0 && postData.shareCount}
          </p>
        </span>
        {/* 收藏 */}
        <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'bookmark', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
          <p className="text-md font-bold text-center text-gray-400 dark:text-gray-100">
            {postData.collectionCount !== 0 && postData.collectionCount}
          </p>
        </span>
      </div>
    </div>
  );
}

export default PostInfoPanel;
