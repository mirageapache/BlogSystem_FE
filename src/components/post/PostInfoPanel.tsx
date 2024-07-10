/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { faHeart as faHeartSolid, faSquarePen, faShare } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import {
  faHeart as faHeartRegular,
  faComment,
  faBookmark,
} from '@fortawesome/free-regular-svg-icons';
// --- functions / types ---
import { toggleLikePost } from 'api/post';
import { setSignInPop } from 'redux/loginSlice';
import { PostDataType } from 'types/postType';
import { errorAlert } from 'utils/fetchError';
import { getCookies } from 'utils/common';
import { setPostId, setPostData, setShowEditModal } from '../../redux/postSlice';
import { checkLogin } from '../../utils/common';
// --- components ---
import PostInfoItem from './PostInfoItem';

function PostInfoPanel(props: { postData: PostDataType }) {
  const { postData } = props;
  const dispatchSlice = useDispatch();
  const userId = getCookies('uid');
  const [post, setPost] = useState(postData);
  const isLike = !isEmpty(post.likedByUsers.find((item) => item._id === userId)); // 顯示是否喜歡該貼文
  const likeCount = post.likedByUsers.length; // 喜歡數
  const commentCount = post.comments.length; // 留言數

  const likeMutation = useMutation((action: boolean) => toggleLikePost(post._id, userId!, action), {
    onSuccess: (res) => {
      setPost(res.updateResult);
    },
    onError: () => errorAlert(),
  });

  /** 喜歡/取消喜歡貼文 */
  const handleLikePost = (e: any) => {
    e.stopPropagation();
    if (!checkLogin()) {
      dispatchSlice(setSignInPop(true));
      return;
    }
    likeMutation.mutate(!isLike);
  };

  /** 處理編輯貼文按鈕 */
  const handleClickEdit = (e: any) => {
    e.stopPropagation();
    dispatchSlice(setPostId(post._id));
    dispatchSlice(setPostData(post));
    dispatchSlice(setShowEditModal(true));
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        {/* 喜歡 */}
        {isLike ? (
          <PostInfoItem
            iconName={faHeartSolid}
            tipText="取消喜歡"
            count={likeCount || 0}
            faClass="text-red-500 hover:text-gray-400"
            tipClass="w-20"
            handleClick={handleLikePost}
          />
        ) : (
          <PostInfoItem
            iconName={faHeartRegular}
            tipText="喜歡"
            count={likeCount || 0}
            faClass="text-gray-400 dark:text-gray-100 hover:text-red-500"
            tipClass="w-12"
            handleClick={handleLikePost}
          />
        )}

        {/* 留言 */}
        <PostInfoItem
          iconName={faComment}
          tipText="留言"
          count={commentCount || 0}
          faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500"
          tipClass="w-12"
          handleClick={() => {}}
        />
      </div>

      <div className="flex gap-4">
        {/* 分享 */}
        <PostInfoItem
          iconName={faShare}
          tipText="分享"
          count={post.shareCount || undefined}
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
          tipClass="w-12"
          handleClick={() => {}}
        />

        {/* 收藏 */}
        <PostInfoItem
          iconName={faBookmark}
          tipText="收藏"
          count={post.collectionCount || undefined}
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
          tipClass="w-12"
          handleClick={() => {}}
        />

        {/* 編輯 */}
        {userId === post.author._id && (
          <PostInfoItem
            iconName={faSquarePen} // 透過props傳遞icon名稱
            tipText="編輯"
            count={undefined}
            faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500"
            tipClass="w-12"
            handleClick={handleClickEdit}
          />
        )}
      </div>
    </div>
  );
}

export default PostInfoPanel;
