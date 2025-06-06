/* eslint-disable react/no-danger */
/* eslint-disable no-restricted-globals */
import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserInfoPanel from 'components/user/UserInfoPanel';
import PostLoading from 'components/post/PostLoading';
import CommentList from 'components/comment/CommentList';
import PostInfoPanel from 'components/post/PostInfoPanel';
// --- api ---
import { getPostDetail } from 'api/post';
import { formatDateTime } from 'utils/dateTime';
import { handleHashTag } from 'utils/input';
import { createComment } from 'api/comment';
import { errorAlert } from 'utils/fetch';
import { getCookies } from 'utils/common';
import { useDispatch } from 'react-redux';
import { setSignInPop } from 'redux/loginSlice';
import { CommentDataType } from 'types/commentType';
import { HINT_LABEL } from 'constants/LayoutConstants';

function PostDetailPage() {
  const dispatch = useDispatch();
  const [showCreateTip, setShowCreateTip] = useState(false); // 判斷是否顯示"建立貼文日期"提示
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文日期"提示
  const [commentContent, setCommentContent] = useState(''); // 留言內容
  const [showPlaceholder, setShowPlaceholder] = useState(isEmpty(commentContent)); // placeholder 顯示控制
  const commentInput = useRef<HTMLDivElement>(null); // 輸入框div

  const { id } = useParams();
  const { isLoading, error, data, refetch } = useQuery(['postDetail', id], () =>
    getPostDetail(id!)
  );
  const postData = get(data, 'data');
  const commentList = get(postData, 'comments', []) as CommentDataType[];

  /** 處理div輸入 */
  const handleCommentInput = () => {
    if (commentInput.current) {
      const { formattedContent } = handleHashTag(commentInput.current.innerText);
      setCommentContent(formattedContent);
    }
  };

  /** 回覆貼文 mutation */
  const { mutate: CommentMutation, isLoading: commentLoading } = useMutation(
    ({ postId, userId, content }: { postId: string; userId: string; content: string }) =>
      createComment(postId, userId, content, 'post'),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          commentInput.current!.innerText = '';
          setCommentContent('');
          refetch();
        }
      },
      onError: () => errorAlert(),
      // error type:未登入、沒有內容
    }
  );

  /** 回覆貼文 */
  const submitComment = () => {
    if (commentContent.trim().length === 0) return; // 檢查有沒有留言內容
    const userId = getCookies('uid') as string;

    if (isEmpty(userId)) {
      dispatch(setSignInPop(true));
      return;
    }

    CommentMutation({ postId: id!, userId, content: commentContent });
  };

  if (isLoading) return <PostLoading withBorder={false} />;
  if (error) return <p>Error</p>;
  if (isEmpty(postData)) {
    return (
      <NoSearchResult
        msgOne="該貼文資料不存在或已刪除"
        msgTwo="無法瀏覽內容，請重新操作"
        type="post"
      />
    );
  }

  return (
    <div className="flex flex-col items-center border-b-[1px] dark:border-gray-700 w-full md:w-[600px] cursor-default">
      <div className="hidden sm:flex items-center my-3 w-full">
        <button
          aria-label="back"
          type="button"
          className="flex justify-center items-center p-2 text-gray-500 hover:text-orange-500"
          onClick={() => history.back()}
        >
          <FontAwesomeIcon
            icon={icon({ name: 'circle-left', style: 'solid' })}
            className="w-7 h-7"
          />
        </button>
      </div>
      <div className="w-minus50 sm:w-full">
        <div className="flex justify-between">
          <UserInfoPanel
            userId={postData.author._id}
            account={postData.author.account}
            name={postData.author.name}
            avatarUrl={postData.author.avatar}
            bgColor={postData.author.bgColor}
            className="my-2"
          />
          <div className="flex flex-col justify-center items-end">
            <span
              className="relative my-0.5"
              onMouseEnter={() => setShowCreateTip(true)}
              onMouseLeave={() => setShowCreateTip(false)}
            >
              <p className="text-gray-600 dark:text-gray-300">
                {formatDateTime(postData.createdAt)}
              </p>
              <span
                className={`top-[-25px] right-0 w-40 ${HINT_LABEL} ${showCreateTip ? 'block' : 'hidden'}`}
              >
                Created at {moment(postData.createdAt).format('MMMM Do YYYY, h:mm:ss')}
              </span>
            </span>
            {!isEmpty(postData.editedAt) && (
              <span
                className="relative my-0.5"
                onMouseEnter={() => setShowEditTip(true)}
                onMouseLeave={() => setShowEditTip(false)}
              >
                <small className="text-gray-400">(已編輯)</small>
                <span className={`right-0 w-40 ${HINT_LABEL} ${showEditTip ? 'block' : 'hidden'}`}>
                  Edited at {moment(postData.editedAt).format('MMMM Do YYYY, h:mm:ss')}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="sm:ml-[60px] border-b-[1px] border-gray-300 dark:border-gray-700 pb-3">
          {/* image */}
          {!isEmpty(postData.image) && (
            <div className="w-full">
              <img className="w-full rounded-md" src={postData.image} alt="postImage" />
            </div>
          )}

          {/* content */}
          <div className="my-2">
            <div
              id="post-container"
              className="text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </div>

          {/* info panel */}
          <PostInfoPanel postData={postData} />

          {/* reply input */}
          <div className="flex justify-between mt-3">
            <div
              ref={commentInput}
              contentEditable
              aria-placeholder="留言"
              className="w-full mr-2 py-1.5 px-2 rounded-md outline-none bg-gray-100 dark:bg-gray-800"
              onInput={handleCommentInput}
              onFocus={() => {
                setShowPlaceholder(false);
              }}
              onBlur={() => {
                if (isEmpty(commentContent)) setShowPlaceholder(true);
              }}
            />
            <span
              className={`absolute mr-2 py-1.5 px-2 text-gray-500 ${showPlaceholder ? 'block' : 'hidden'}`}
            >
              留言...
            </span>
            <button
              aria-label="reply"
              type="button"
              className={`w-16 h-9 p-0.5 rounded-md text-white ${commentContent.length > 0 ? 'bg-green-600' : 'bg-gray-500'}`}
              onClick={submitComment}
            >
              {commentLoading ? (
                <FontAwesomeIcon
                  icon={icon({ name: 'spinner', style: 'solid' })}
                  className="animate-spin h-5 w-5 m-1.5"
                />
              ) : (
                '回覆'
              )}
            </button>
          </div>
        </div>

        {/* comments Section */}
        <div className="mt-3 sm:ml-[60px]">
          <CommentList commentListData={commentList} />
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
