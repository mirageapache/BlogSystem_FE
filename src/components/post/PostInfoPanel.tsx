/* eslint-disable jsx-a11y/control-has-associated-label */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { PostDataType } from 'types/postType';
import { getCookies } from 'utils/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPostId, setShowEditModal } from '../../redux/postSlice';
import PostInfoItem from './PostInfoItem';

function PostInfoPanel(props: { postData: PostDataType }) {
  const { postData } = props;
  const likeCount = postData.likedByUsers.length; // 喜歡數
  const commentCount = postData.comments.length; // 留言數
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文"提示
  const userId = getCookies('uid');
  const dispatchSlice = useDispatch();

  /** 處理編輯貼文按鈕 */
  const handleClickEdit = () => {
    dispatchSlice(setPostId(postData._id));
    dispatchSlice(setShowEditModal(true));
  };

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
        <span className="mr-5 flex justify-center items-center cursor-pointer">
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

        {/* 編輯 */}
        {userId === postData.author._id && (
          // <span
          //   className="relative"
          //   onMouseEnter={() => setShowEditTip(true)}
          //   onMouseLeave={() => setShowEditTip(false)}
          // >
          //   <button
          //     type="button"
          //     className="flex justify-center items-center text-gray-500 hover:text-orange-500"
          //     onClick={handleClickEdit}
          //   >
          //     <FontAwesomeIcon
          //       icon={icon({ name: 'square-pen', style: 'solid' })}
          //       className="w-5 h-5 m-1.5"
          //     />
          //   </button>
          //   <span
          //     className={`absolute top-[-25px] right-0 w-20 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
          //       showEditTip ? 'block' : 'hidden'
          //     }`}
          //   >
          //     編輯貼文
          //   </span>
          // </span>
          <PostInfoItem
            iconName="square-pen"
            iconStyle="solid"
            tipText="編輯貼文"
            handleClick={handleClickEdit}
          />
        )}
      </div>
    </div>
  );
}

export default PostInfoPanel;
