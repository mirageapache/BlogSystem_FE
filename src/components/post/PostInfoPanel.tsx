/* eslint-disable jsx-a11y/control-has-associated-label */
import { useDispatch } from 'react-redux';
import { faHeart as faHeartSolid, faSquarePen, faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment, faBookmark } from '@fortawesome/free-regular-svg-icons';
// --- components ---
import PostInfoItem from './PostInfoItem';
// --- functions / types ---
import { PostDataType } from 'types/postType';
import { getCookies } from 'utils/common';
import { setPostId, setShowEditModal } from '../../redux/postSlice';

function PostInfoPanel(props: { postData: PostDataType }) {
  const { postData } = props;
  const likeCount = postData.likedByUsers.length; // 喜歡數
  const commentCount = postData.comments.length; // 留言數
  const userId = getCookies('uid');
  const dispatchSlice = useDispatch();

  /** 處理編輯貼文按鈕 */
  const handleClickEdit = () => {
    dispatchSlice(setPostId(postData._id));
    dispatchSlice(setShowEditModal(true));
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        {/* 喜歡 */}
        <PostInfoItem
          iconName={faHeartRegular}
          tipText="喜歡"
          count={likeCount || 0}
          faClass="text-gray-400 dark:text-gray-100 hover:text-red-500"
          handleClick={() => {}}
        />

        {/* 留言 */}
        <PostInfoItem
          iconName={faComment}
          tipText="留言"
          count={commentCount || 0}
          faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500"
          handleClick={() => {}}
        />
      </div>

      <div className="flex gap-4">
        {/* 分享 */}
        <PostInfoItem
          iconName={faShare}
          tipText="分享"
          count={postData.shareCount || undefined}
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
          handleClick={() => {}}
        />

        {/* 收藏 */}
        <PostInfoItem
          iconName={faBookmark}
          tipText="收藏"
          count={postData.collectionCount || undefined}
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
          handleClick={() => {}}
        />

        {/* 編輯 */}
        {userId === postData.author._id && (
          <PostInfoItem
            iconName={faSquarePen} // 透過props傳遞icon名稱
            tipText="編輯"
            count={undefined}
            faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
            handleClick={handleClickEdit}
          />
        )}
      </div>
    </div>
  );
}

export default PostInfoPanel;
