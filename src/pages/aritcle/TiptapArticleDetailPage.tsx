/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-danger */
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- api / functions / types ---
import { handleHashTag } from 'utils/input';
import { createComment } from 'api/comment';
import { errorAlert, handleStatus } from 'utils/fetch';
import { CommentDataType } from 'types/commentType';
import { setSignInPop } from 'redux/loginSlice';
import { getCookies } from 'utils/common';
import { getArticleDetail, updateArticle } from '../../api/article';
import { setEditMode, SysStateType } from '../../redux/sysSlice';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import NoSearchResult from '../../components/tips/NoSearchResult';
import ArticleLoading from '../../components/article/ArticleLoading';
import CommentList from '../../components/comment/CommentList';
import TiptapToolBar from '../../components/common/TiptapToolBar';
import BasicErrorPanel from '../../components/tips/BasicErrorPanel';
import { ERR_NETWORK_MSG } from '../../constants/StringConstants';

interface StateType {
  system: SysStateType;
}

function TiptapArticleDetailPage() {
  const dispatch = useDispatch();
  const userId = getCookies('uid'); // user id
  const { id } = useParams(); // article id
  const editMode = useSelector((state: StateType) => state.system.editMode); // 編輯模式
  const { isLoading, data, refetch } = useQuery(['articleDetail', id], () => getArticleDetail(id!));
  const articleData = get(data, 'data');
  const [title, setTitle] = useState(''); // article title

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '從這裡開始你的故事...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  useEffect(() => {
    // init article content
    if (articleData && editor) {
      editor.commands.setContent(articleData.content);
      setTitle(articleData.title);
    }
  }, [articleData, editor]);

  // comment data
  const commentList = get(articleData, 'comments', []) as CommentDataType[];
  const commentInput = useRef<HTMLDivElement>(null); // 留言輸入框div
  const [commentContent, setCommentContent] = useState(''); // 留言內容
  const [showPlaceholder, setShowPlaceholder] = useState(isEmpty(commentContent)); // placeholder 顯示控制

  /** 處理comment div輸入 */
  const handleCommentInput = () => {
    if (commentInput.current) {
      const { formattedContent } = handleHashTag(commentInput.current.innerText);
      setCommentContent(formattedContent);
    }
  };

  /** 回覆貼文 mutation */
  const { mutate: CommentMutation, isLoading: commentLoading } = useMutation(
    ({ articleId, content }: { articleId: string; content: string }) =>
      createComment(articleId, userId!, content, 'article'),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          commentInput.current!.innerText = '';
          setCommentContent('');
          refetch();
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 回覆貼文 */
  const submitComment = () => {
    if (commentContent.trim().length === 0) return; // 檢查有沒有留言內容

    if (isEmpty(userId)) {
      dispatch(setSignInPop(true));
      return;
    }

    CommentMutation({ articleId: id!, content: commentContent });
  };

  /** 編輯文章 mutation */
  const editArticleMutation = useMutation(
    ({ content }: { content: string }) => updateArticle(articleData!._id, userId!, title, content),
    {
      onSuccess: (res) => {
        if (handleStatus(get(res, 'status')) === 2) {
          const swal = withReactContent(Swal);
          swal
            .fire({
              title: '文章已更新',
              icon: 'success',
              confirmButtonText: '確認',
            })
            .then((result) => {
              refetch();
              if (result.isConfirmed) dispatch(setEditMode(false));
            });
        } else if (handleStatus(get(res, 'status')) === 5) {
          errorAlert(get(res, 'data.message'));
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          errorAlert(ERR_NETWORK_MSG);
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 修改文章 */
  const handleSubmit = () => {
    const content = editor?.getHTML();
    if (content) {
      editArticleMutation.mutate({ content });
    }
  };

  if (isLoading) return <ArticleLoading withBorder={false} />;
  if (get(data, 'code') === 'ERR_NETWORK') {
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;
  }

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
      <div className="w-full mb-2 px-2 sm:px-5">
        <div className=" flex items-center border-b-[1px] xl:border-b-0 dark:border-gray-700">
          <button
            aria-label="back"
            type="button"
            className="hidden sm:flex items-center mr-4 p-2 text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
            onClick={() => {
              if (editMode) dispatch(setEditMode(false));
              else window.history.back();
            }}
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
            <ArticleInfoPanel
              articleData={articleData}
              commentInput={commentInput}
              title={articleData.title}
              hasContent
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          {editMode ? (
            <>
              <TiptapToolBar editor={editor} />
              <div className="mb-2">
                <input
                  type="text"
                  name="title"
                  placeholder="文章標題"
                  value={title}
                  className="w-full text-2xl outline-none dark:text-white dark:bg-gray-950"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </>
          ) : (
            <h2 className="text-4xl my-4">{articleData.title}</h2>
          )}
          {/* 文章內文 */}
          <div
            className={`relative p-0.5 ${editMode ? 'max-h-minus325 h-minus325 overflow-y-auto' : ''}`}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
        {/* comments Section */}
        {!editMode && (
          <div className="relative mt-3 border-t-[1px]">
            <div className="flex justify-between my-3">
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

            {/* 留言串 */}
            <CommentList commentListData={commentList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TiptapArticleDetailPage;
