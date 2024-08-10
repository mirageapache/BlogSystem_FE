/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-danger */
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import { customStyleMap } from 'constants/CustomStyleMap';
// --- api / functions / types ---
import { handleHashTag } from 'utils/input';
import { createComment } from 'api/comment';
import { errorAlert } from 'utils/fetchError';
import { CommentDataType } from 'types/commentType';
import { setSignInPop } from 'redux/loginSlice';
import { getCookies } from 'utils/common';
import { getArticleDetail } from '../../api/article';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import NoSearchResult from '../../components/tips/NoSearchResult';
import Spinner from '../../components/tips/Spinner';
import CommentList from '../../components/comment/CommentList';

function ArticleDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { isLoading, error, data, refetch } = useQuery(['articleDetail', id], () =>
    getArticleDetail(id!)
  );
  const articleData = get(data, 'data');
  const commentList = get(articleData, 'comments', []) as CommentDataType[];
  const commentInput = useRef<HTMLDivElement>(null); // 留言輸入框div
  const [commentContent, setCommentContent] = useState(''); // 留言內容
  const [showPlaceholder, setShowPlaceholder] = useState(isEmpty(commentContent)); // placeholder 顯示控制

  useEffect(() => {
    if (articleData) {
      const rawContent = JSON.parse(articleData.content);
      const contentState = convertFromRaw(rawContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [articleData]);

  /** 處理comment div輸入 */
  const handleCommentInput = () => {
    if (commentInput.current) {
      const { formattedContent } = handleHashTag(commentInput.current.innerText);
      setCommentContent(formattedContent);
    }
  };

  /** 回覆貼文 mutation */
  const CommentMutation = useMutation(
    ({ articleId, userId, content }: { articleId: string; userId: string; content: string }) =>
      createComment(articleId, userId, content, 'article'),
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

    CommentMutation.mutate({ articleId: id!, userId, content: commentContent });
  };

  if (isLoading) return <Spinner />;
  if (error) return <p>Error</p>;
  if (isEmpty(articleData)) {
    return (
      <NoSearchResult
        msgOne="該文章不存在或已刪除"
        msgTwo="無法瀏覽內容，請重新操作"
        type="article"
      />
    );
  }

  return (
    <div className="flex justify-center w-full md:w-[600px]">
      <div className="flex flex-col w-full m-5">
        <div className=" flex items-center border-b-[1px] xl:border-b-0 dark:border-gray-700">
          <button
            aria-label="back"
            type="button"
            className="hidden sm:flex items-center mr-4 p-2 text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
            onClick={() => history.back()}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'circle-left', style: 'solid' })}
              className="w-7 h-7"
            />
          </button>
          <div className="flex justify-between items-center w-full xl:border-b-[1px] dark:border-gray-700">
            {/* 作者資訊 */}
            <UserInfoPanel
              userId={articleData.author._id}
              account={articleData.author.account}
              name={articleData.author.name}
              avatarUrl={articleData.author.avatar}
              bgColor={articleData.author.bgColor}
              className="my-4"
            />

            {/* 文章資訊 */}
            <ArticleInfoPanel articleData={articleData} />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="text-4xl my-4">{articleData.title}</h2>
          {/* 文章內文 */}
          <div className="">
            <Editor
              editorState={editorState}
              readOnly
              onChange={() => {}}
              customStyleMap={customStyleMap}
            />
          </div>
        </div>
        {/* comments Section */}
        <div className="mt-3 sm:ml-[60px] border-t-[1px]">
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
              回覆
            </button>
          </div>

          {/* 留言串 */}
          <CommentList commentListData={commentList} />
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
