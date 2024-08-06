/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useRef, useState } from 'react';
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useMutation } from 'react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { stateToHTML } from 'draft-js-export-html';
import { customStyleMap } from 'constants/CustomStyleMap';
import EditorToolBar from 'components/common/EditorToolBar';
import AtomicBlock from 'components/common/EditorComponent/AtomicBlock';
import { createArticle } from 'api/article';
import { errorAlert } from 'utils/fetchError';
import { getCookies } from 'utils/common';
import '../../styles/editor.scss';
import { isEmpty } from 'lodash';

function ArticleCreatePage() {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty()); // 編輯內容
  const contentState = editorState.getCurrentContent();
  const editorRef = useRef(null);
  const hasContent =
    editorState.getCurrentContent().hasText() || // hasTest() 判斷Editor內是否有內容
    editorState.getCurrentContent().getBlockMap().first().getType() !== 'unstyled'; // .getBlockMap().first().getType() 判斷第一段內容的類型是否有被定義

  /** 渲染 Atomic 區塊 */
  const blockRendererFn = (contentBlock) => {
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
  const insertAtomicBlock = (src) => {
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    return EditorState.forceSelection(
      newEditorState,
      newEditorState.getCurrentContent().getSelectionAfter()
    );
  };

  /** 觸發上傳圖片input */
  const handleFileInput = (e) => {
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
  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  /** 字體類型設定 */
  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  /** 新增文章 mutation */
  const createArticleMutation = useMutation(
    ({ userId, title, content }) => createArticle(userId, title, content),
    {
      onSuccess: (res) => {
        console.log(res);
        if (res.status === 200) {
          const swal = withReactContent(Swal);
          swal.fire({
            title: '文章已發佈',
            icon: 'success',
            confirmButtonText: '確認',
          });
        }
      },
      onError: (err) => errorAlert(),
    }
  );

  /** 發佈文章 */
  const handleSubmit = () => {
    const htmlContent = stateToHTML(contentState);
    console.log(htmlContent);

    const userId = getCookies('uid');
    createArticleMutation.mutate({ userId, title, content:htmlContent});
  };

  return (
    <div className="w-full md:max-w-[600px] mx-2 sm:m-0">
      {/* header */}
      <div className="flex justify-between items-center p-2">
        <div className="w-10 sm:w-24">
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
        <p className="text-2xl font-bold">建立文章</p>
        {!isEmpty(title) && hasContent ? (
          <button
            type="button"
            className="flex justify-center items-center w-10 sm:w-24 p-2 sm:py-1.5 text-white rounded-md bg-green-600"
            onClick={handleSubmit}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'file-circle-check', style: 'solid' })}
              className="w-6 h-6 sm:hidden"
            />
            <p className="hidden sm:block">發佈</p>
          </button>
        ) : (
          <button
            type="button"
            className="flex justify-center items-center w-10 sm:w-24 p-2 sm:py-1.5 text-white rounded-md bg-gray-600 cursor-default"
          >
            <FontAwesomeIcon
              icon={icon({ name: 'file-circle-check', style: 'solid' })}
              className="w-6 h-6 sm:hidden"
            />
            <p className="hidden sm:block">發佈</p>
          </button>
        )}
      </div>

      {/* 文字編輯工具列 */}
      {/* 字體、粗體、斜體、底線、刪除線、文字顏色、醒目提示顏色、對齊(左中右) */}
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
      <div
        className="relative max-h-minus180 h-minus180 overflow-y-auto"
        onClick={() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }}
      >
        {/* 文章內容 */}
        {!hasContent && (
          <div id="placeholder" className="absolute text-gray-500">
            從這裡開始你的故事...
          </div>
        )}
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          customStyleMap={customStyleMap}
          ref={editorRef}
          blockRendererFn={blockRendererFn}
        />
      </div>
    </div>
  );
}

export default ArticleCreatePage;
