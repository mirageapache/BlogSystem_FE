import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEditor, EditorContent } from '@tiptap/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- api / functions / types ---
import { handleHashTag } from 'utils/input';
import { createComment } from 'api/comment';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { guardVisitorAction } from 'utils/common';
import { editorExtensions } from 'utils/tiptap';
import { CommentDataType } from 'types/commentType';
import { setSignInPop } from 'redux/loginSlice';
import { UserStateType } from '../../redux/userSlice';
import { getArticleDetail, updateArticle } from '../../api/article';
import { setEditMode, SysStateType } from '../../redux/sysSlice';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import NoSearchResult from '../../components/tips/NoSearchResult';
import ArticleLoading from '../../components/article/ArticleLoading';
import CommentList from '../../components/comment/CommentList';
import EditorToolBar from '../../components/common/EditorToolBar';
import BasicErrorPanel from '../../components/tips/BasicErrorPanel';
import { ERR_NETWORK_MSG, ARTICLE_STATUS } from '../../constants/StringConstants';
import '../../styles/editor.scss';

interface StateType {
  system: SysStateType;
  user: UserStateType;
}

function ArticleDetailPage() {
  const dispatch = useDispatch();
  const userId = useSelector((state: StateType) => state.user.userData?.userId); // user id
  const { id } = useParams(); // article id
  const editMode = useSelector((state: StateType) => state.system.editMode); // 編輯模式
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['articleDetail', id],
    queryFn: () => getArticleDetail(id!),
  });
  const articleData = get(data, 'data');

  const [title, setTitle] = useState(''); // article title

  // Tiptap 編輯器（內容為 HTML）；非編輯模式時唯讀
  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    editable: editMode,
  });

  // init article content（內容已是 HTML，Tiptap 直接載入）
  useEffect(() => {
    if (articleData && editor) {
      editor.commands.setContent(articleData.content || '');
      setTitle(articleData.title);
    }
  }, [articleData, editor]);

  // 編輯模式切換時同步 editor 可編輯狀態
  useEffect(() => {
    editor?.setEditable(editMode);
  }, [editMode, editor]);

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
  const { mutate: CommentMutation, isPending: commentLoading } = useMutation({
    mutationFn: ({ articleId, content }: { articleId: string; content: string }) =>
      createComment(articleId, content, 'article'),
    onSuccess: (res) => {
      if (res.status === 200) {
        commentInput.current!.innerText = '';
        setCommentContent('');
        refetch();
      } else if (handleStatus(get(res, 'status', 0)) === 4) {
        handleApiError(res);
      }
    },
    onError: () => errorAlert(),
    // error type:未登入、沒有內容
  });

  /** 回覆貼文 */
  const submitComment = () => {
    if (commentContent.trim().length === 0) return; // 檢查有沒有留言內容

    if (isEmpty(userId)) {
      dispatch(setSignInPop(true));
      return;
    }
    if (guardVisitorAction()) return;

    CommentMutation({ articleId: id!, content: commentContent });
  };

  /** 編輯文章 mutation */
  const editArticleMutation = useMutation({
    mutationFn: ({ content, status }: { content: string; status?: number }) =>
      updateArticle(articleData!._id, title, content, status),
    onSuccess: (res, { status }) => {
      if (handleStatus(get(res, 'status')) === 2) {
        const swal = withReactContent(Swal);
        let alertTitle = '文章已更新';
        if (status === ARTICLE_STATUS.OFFLINE) alertTitle = '文章已下架';
        else if (status === ARTICLE_STATUS.DRAFT) alertTitle = '草稿已儲存';
        else if (status === ARTICLE_STATUS.PUBLIC || status === ARTICLE_STATUS.MEMBER)
          alertTitle = '文章已發佈';
        swal
          .fire({ title: alertTitle, icon: 'success', confirmButtonText: '確認' })
          .then((result) => {
            refetch();
            if (result.isConfirmed) dispatch(setEditMode(false));
          });
      } else if (handleStatus(get(res, 'status')) === 4) {
        handleApiError(res);
      } else if (handleStatus(get(res, 'status')) === 5) {
        errorAlert(get(res, 'data.message'));
      } else if (get(res, 'code') === 'ERR_NETWORK') {
        errorAlert(ERR_NETWORK_MSG);
      }
    },
    onError: () => errorAlert(),
  });

  /** 修改文章 */
  const handleSubmit = (status?: number) => {
    if (guardVisitorAction()) return;
    // title 為後端必填欄位，空白會撞 500，前端先擋並給提示
    if (isEmpty(title.trim())) {
      errorAlert('請輸入文章標題');
      return;
    }
    const contentString = editor ? editor.getHTML() : '';
    editArticleMutation.mutate({ content: contentString, status });
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
    <div
      className={`flex justify-center w-full max-w-4xl ${editMode ? 'h-[calc(100dvh-100px)] sm:h-[calc(100dvh-64px)] overflow-hidden' : ''}`}
    >
      <div className={`w-full px-2 sm:px-5 ${editMode ? 'flex flex-col h-full' : 'mb-2'}`}>
        <div
          className={`flex items-center border-b xl:border-b-0 border-line ${editMode ? 'shrink-0' : ''}`}
        >
          <button
            aria-label="back"
            type="button"
            className="hidden sm:flex items-center mr-4 p-2 text-muted hover:text-brand transition-colors xl:absolute xl:left-5"
            onClick={() => {
              if (editMode) dispatch(setEditMode(false));
              else window.history.back();
            }}
          >
            <FontAwesomeIcon icon={faCircleLeft} className="w-7 h-7" />
          </button>
          <div className="flex justify-between items-center w-full xl:border-b border-line">
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
              title={title}
              hasContent
              handleSubmit={handleSubmit}
              articleStatus={articleData.status}
            />
          </div>
        </div>
        <div className={`flex flex-col w-full ${editMode ? 'flex-1 min-h-0' : ''}`}>
          {editMode ? (
            <>
              <div className="shrink-0">
                <EditorToolBar editor={editor} />
              </div>
              <div className="shrink-0 mb-2">
                <input
                  type="text"
                  name="title"
                  placeholder="文章標題"
                  value={title}
                  className="w-full text-2xl outline-none focus-visible:outline-none bg-transparent text-ink placeholder:text-muted"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </>
          ) : (
            <h2 className="text-4xl my-4">{articleData.title}</h2>
          )}
          {/* 文章內文 */}
          <div className={`relative p-0.5 ${editMode ? 'flex-1 min-h-0 overflow-y-auto' : ''}`}>
            <EditorContent editor={editor} />
          </div>
        </div>
        {/* comments Section */}
        {!editMode && (
          <div className="relative mt-3 border-t border-line">
            <div className="flex justify-between my-3">
              <div
                ref={commentInput}
                contentEditable
                aria-placeholder="留言"
                className="w-full mr-2 py-1.5 px-2 rounded-md outline-none focus-visible:outline-none bg-surface-2 text-ink"
                onInput={handleCommentInput}
                onFocus={() => {
                  setShowPlaceholder(false);
                }}
                onBlur={() => {
                  if (isEmpty(commentContent)) setShowPlaceholder(true);
                }}
              />
              <span
                className={`absolute mr-2 py-1.5 px-2 text-muted ${showPlaceholder ? 'block' : 'hidden'}`}
              >
                留言...
              </span>
              <button
                aria-label="reply"
                type="button"
                className={`w-16 h-9 p-0.5 rounded-md transition-colors ${commentContent.length > 0 ? 'bg-brand hover:bg-brand-strong text-white' : 'bg-surface-2 text-muted'}`}
                onClick={submitComment}
              >
                {commentLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 m-1.5" />
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

export default ArticleDetailPage;
