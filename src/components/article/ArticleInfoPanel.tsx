import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { faHeart as faHeartSolid, faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons';
// --- functions / types ---
import { ArticleDataType } from 'types/articleType';
import { checkLogin, getCookies } from 'utils/common';
import { errorAlert } from 'utils/fetch';
import { toggleLikeArticle } from 'api/article';
import { setSignInPop } from 'redux/loginSlice';
import { setEditMode, SysStateType } from 'redux/sysSlice';
// --- components ---
import ArticleInfoItem from './ArticleInfoItem';

interface StateType {
  system: SysStateType;
}

interface PropTypes {
  articleData: ArticleDataType;
  commentInput: React.RefObject<HTMLDivElement>;
  title: string;
  hasContent: boolean;
  handleSubmit: () => void;
}

function ArticleInfoPanel({
  articleData,
  commentInput,
  title,
  hasContent,
  handleSubmit,
}: PropTypes) {
  const userId = getCookies('uid');
  const dispatchSlice = useDispatch();
  const editMode = useSelector((state: StateType) => state.system.editMode); // 編輯模式
  const [article, setArticle] = useState(articleData);
  const isLike = !isEmpty(article.likedByUsers.find((item) => item._id === userId)); // 顯示是否喜歡該貼文
  const likeCount = article.likedByUsers.length; // 喜歡數
  const commentCount = article.comments.length; // 留言數

  /** 喜歡/取消喜歡 mutation */
  const likeMutation = useMutation(
    (action: boolean) => toggleLikeArticle(article._id, userId!, action),
    {
      onSuccess: (res) => {
        setArticle(res.updateResult);
      },
      onError: () => errorAlert(),
    }
  );

  /** 喜歡/取消喜歡貼文 */
  const handleLikeArticle = (e: any) => {
    e.stopPropagation();
    if (!checkLogin()) {
      dispatchSlice(setSignInPop(true));
      return;
    }
    likeMutation.mutate(!isLike);
  };

  /** 處理編輯文章按鈕 */
  const handleClickEdit = (e: any) => {
    e.stopPropagation();
    dispatchSlice(setEditMode(true));
  };

  return (
    <div className="flex items-center">
      {editMode ? (
        <div className="flex gap-2">
          {!isEmpty(title) && hasContent ? (
            <button
              type="button"
              className="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              <p className="text-[14px] sm:text-[16px]">更新</p>
            </button>
          ) : (
            <button
              type="button"
              className="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-gray-600 cursor-default"
            >
              <p className="text-[14px] sm:text-[16px]">更新</p>
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          {/* 喜歡 */}
          {isLike ? (
            <ArticleInfoItem
              iconName={faHeartSolid}
              tipText="取消喜歡"
              count={likeCount || 0}
              faClass="text-red-500 hover:text-gray-400"
              tipClass="w-20"
              handleClick={handleLikeArticle}
            />
          ) : (
            <ArticleInfoItem
              iconName={faHeartRegular}
              tipText="喜歡"
              count={likeCount || 0}
              faClass="text-gray-400 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-500"
              tipClass="w-12"
              handleClick={handleLikeArticle}
            />
          )}

          {/* 留言 */}
          <ArticleInfoItem
            iconName={faComment}
            tipText="留言"
            count={commentCount || 0}
            faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-500"
            tipClass="w-12"
            handleClick={() => {
              commentInput.current?.focus();
            }}
          />

          {/* 編輯 */}
          {userId === article.author._id && (
            <ArticleInfoItem
              iconName={faSquarePen} // 透過props傳遞icon名稱
              tipText="編輯"
              count={undefined}
              faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
              tipClass="w-12"
              handleClick={handleClickEdit}
            />
          )}
        </div>
      )}

      {/* <div className="flex gap-5"> */}
      {/* 閱讀時間 */}
      {/* <span className="hidden md:flex justify-center items-center text-gray-400 dark:text-gray-100 cursor-default">
          閱讀時間：5分鐘
        </span> */}
      {/* 分享 */}
      {/* <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'share-from-square', style: 'solid' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
        </span> */}
      {/* 收藏 */}
      {/* <span className="flex justify-center items-center cursor-pointer">
          <FontAwesomeIcon
            icon={icon({ name: 'bookmark', style: 'regular' })}
            className="h-5 w-5 m-1.5 text-gray-400 dark:text-gray-100 hover:text-orange-500"
          />
        </span> */}
      {/* </div> */}
    </div>
  );
}

export default ArticleInfoPanel;
