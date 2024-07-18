/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { faHeart as faHeartSolid, faSquarePen, faShare } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons';
// --- functions / types ---
import { toggleLikePost } from 'api/post';
import { setSignInPop } from 'redux/loginSlice';
import { PostDataType } from 'types/postType';
import { errorAlert } from 'utils/fetchError';
import { getCookies } from 'utils/common';
import { setPostId, setPostData, setShowEditModal } from '../../redux/postSlice';
import { checkLogin } from '../../utils/common';
import { HINT_LABEL } from '../../constants/LayoutConstants';
// --- components ---
import PostInfoItem from './PostInfoItem';

function PostInfoPanel(props: { postData: PostDataType }) {
  const { postData } = props;
  const dispatchSlice = useDispatch();
  const userId = getCookies('uid');
  const [post, setPost] = useState(postData);
  const [showShareInfo, setShowShareInfo] = useState(false);
  const [showCopyHint, setShowCopyHint] = useState(false); // 顯示"已複製"提示標籤
  const isLike = !isEmpty(post.likedByUsers.find((item) => item._id === userId)); // 顯示是否喜歡該貼文
  const likeCount = post.likedByUsers.length; // 喜歡數
  const commentCount = post.comments.length; // 留言數
  const url = window.location.toString();

  /** 喜歡/取消喜歡 mutation */
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

  /** 複製貼文連結 */
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyHint(true);
      setTimeout(() => {
        setShowCopyHint(false);
      }, 2000);
    });
  };

  /** 分享至FB */
  const shareToFB = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  /** 分享至Line */
  const shareToLine = () => {
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=與你分享一則Blog貼文}`;
    window.open(shareUrl, '_blank');
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
            faClass="text-gray-400 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-500"
            tipClass="w-12"
            handleClick={handleLikePost}
          />
        )}

        {/* 留言 */}
        <PostInfoItem
          iconName={faComment}
          tipText="留言"
          count={commentCount || 0}
          faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-500"
          tipClass="w-12"
          handleClick={() => {}}
        />
      </div>

      <div className="flex gap-4">
        {/* 分享 */}
        <div className="relative">
          <PostInfoItem
            iconName={faShare}
            tipText="分享"
            count={post.shareCount || undefined}
            faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
            tipClass="w-12"
            handleClick={() => setShowShareInfo(!showShareInfo)}
          />
          {showShareInfo && (
            <div className="relative z-30">
              <div
                className="fixed w-dvw h-dvh top-0 left-0"
                onClick={() => setShowShareInfo(false)}
              />
              <ul className="absolute top-[-180px] right-0 bg-white dark:bg-gray-900 z-40 w-[200px] shadow border border-gray-400 rounded-md p-2 text-gray-700 dark:text-gray-300">
                <li className="relative p-1 hover:bg-gray-300 dark:hover:bg-gray-700">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full p-1"
                    onClick={copyLink}
                  >
                    <FontAwesomeIcon
                      icon={icon({ name: 'link', style: 'solid' })}
                      className="w-6 h-6 text-orange-500"
                    />
                    <p>複製連結</p>
                  </button>
                  <span
                    className={`${HINT_LABEL} w-20 top-[-36px] left-12 ${showCopyHint ? 'block' : 'hidden'}`}
                  >
                    已複製！
                  </span>
                </li>
                <li className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 ">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full p-1"
                    onClick={shareToFB}
                  >
                    <FontAwesomeIcon
                      icon={icon({ name: 'facebook', style: 'brands' })}
                      className="w-6 h-6 text-blue-600"
                    />
                    <p>分享至FaceBook</p>
                  </button>
                </li>
                <li className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full p-1"
                    onClick={shareToLine}
                  >
                    <FontAwesomeIcon
                      icon={icon({ name: 'line', style: 'brands' })}
                      className="w-6 h-6 text-green-600"
                    />
                    <p>分享至Line</p>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* 收藏 -- 暫時不開發，待後續納入新版規劃 */}
        {/* <PostInfoItem
          iconName={faBookmark}
          tipText="收藏"
          count={post.collectionCount || undefined}
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
          tipClass="w-12"
          handleClick={() => {}}
        /> */}

        {/* 編輯 */}
        {userId === post.author._id && (
          <PostInfoItem
            iconName={faSquarePen} // 透過props傳遞icon名稱
            tipText="編輯"
            count={undefined}
            faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
            tipClass="w-12"
            handleClick={handleClickEdit}
          />
        )}
      </div>
    </div>
  );
}

export default PostInfoPanel;
