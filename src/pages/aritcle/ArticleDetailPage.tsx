/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-danger */
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { AtomicBlockUtils, convertFromRaw, convertToRaw, Editor, EditorState, RichUtils } from 'draft-js';
import { customStyleMap } from 'constants/CustomStyleMap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- api / functions / types ---
import { handleHashTag } from 'utils/input';
import { createComment } from 'api/comment';
import { errorAlert } from 'utils/fetchError';
import { CommentDataType } from 'types/commentType';
import { setSignInPop } from 'redux/loginSlice';
import { getCookies } from 'utils/common';
import { getArticleDetail, updateArticle } from '../../api/article';
import { setEditMode, SysStateType } from 'redux/sysSlice';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import NoSearchResult from '../../components/tips/NoSearchResult';
import ArticleLoading from 'components/article/ArticleLoading';
import CommentList from '../../components/comment/CommentList';
import AtomicBlock from 'components/common/EditorComponent/AtomicBlock';
import EditorToolBar from 'components/common/EditorToolBar';

interface StateType {
  system: SysStateType;
}

function ArticleDetailPage() {
  const dispatch = useDispatch();
  const userId = getCookies('uid'); // user id
  const { id } = useParams(); // article id
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef(null);
  const editMode = useSelector((state: StateType) => state.system.editMode); // 編輯模式
  const { isLoading, error, data, refetch } = useQuery(['articleDetail', id], () =>
    getArticleDetail(id!)
  );
  const articleData = get(data, 'data');
  const [title, setTitle] = useState(isEmpty(articleData) ? '' : articleData.title ); // article title
  useEffect(() => {
    // init article content
    if (articleData) {
      const rawContent = JSON.parse(articleData.content);
      const contentState = convertFromRaw(rawContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [articleData]);

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
  const CommentMutation = useMutation(
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
      // error type:未登入、沒有內容
    }
  );

  /** 回覆貼文 */
  const submitComment = () => {
    if (commentContent.trim().length === 0) return; // 檢查有沒有留言內容

    if (isEmpty(userId)) {
      dispatch(setSignInPop(true));
      return;
    }

    CommentMutation.mutate({ articleId: id!, content: commentContent });
  };

  /** 渲染 Atomic 區塊 */
  const blockRendererFn = (contentBlock: { getType: () => any; }) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      // 插入圖片
      return {
        component: AtomicBlock,
        editable: false,
      };
    }
    return null;
  };

  // 在Editor 中插入 Atomic 區塊
  const insertAtomicBlock = (src: string | ArrayBuffer) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    return EditorState.forceSelection(
      newEditorState,
      newEditorState.getCurrentContent().getSelectionAfter()
    );
  };

  /** 觸發上傳圖片input */
  const handleFileInput = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const src = event.target.result;
        setEditorState(insertAtomicBlock(src));
      }
    };
    reader.readAsDataURL(file);
  };

  /** 字型樣式設定 */
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  /** 字體類型設定 */
  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  /** 編輯文章 mutation */
  const editArticleMutation = useMutation(
    ({ content }: { content: string }) => updateArticle(userId!, title, content),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          const swal = withReactContent(Swal);
          swal
            .fire({
              title: '文章已更新',
              icon: 'success',
              confirmButtonText: '確認',
            })
            .then((result) => {
              if (result.isConfirmed) dispatch(setEditMode(false));
            });
        }
      },
      onError: (err) => errorAlert(),
    }
  );

  /** 修改文章 */
  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const contentString = JSON.stringify(rawContent);
    editArticleMutation.mutate({ content: contentString });
  };

  if (isLoading) return <ArticleLoading withBorder={false} />;
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
      <div className="w-full mb-2 mx-5">
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
            <ArticleInfoPanel
              articleData={articleData}
              title={articleData.title}
              hasContent={true} // 待修改
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          {editMode ? 
            <>
              <EditorToolBar
                toggleInlineStyle={toggleInlineStyle}
                toggleBlockType={toggleBlockType}
                handleFileInput={handleFileInput}
              />
              <div className="mb-2">
                <input
                  type="text"
                  name="title"
                  placeholder="文章標題"
                  className="w-full text-2xl outline-none dark:text-white dark:bg-gray-950"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </>
          :
            <h2 className="text-4xl my-4">{articleData.title}</h2>
          }
          {/* 文章內文 */}
          <div className={`relative ${editMode? 'max-h-minus325 h-minus325 overflow-y-auto' : '' }`}>
            <Editor
              editorState={editorState}
              readOnly={!editMode}
              onChange={setEditorState}
              customStyleMap={customStyleMap}
              ref={editorRef}
              blockRendererFn={blockRendererFn}
            />
          </div>
        </div>
        {/* comments Section */}
        {!editMode && 
          <div className="relative mt-3 sm:ml-[60px] border-t-[1px]">
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
                回覆
              </button>
            </div>

            {/* 留言串 */}
            <CommentList commentListData={commentList} />
          </div>
        }
      </div>
    </div>
  );
}

export default ArticleDetailPage;
