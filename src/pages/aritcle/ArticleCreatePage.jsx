/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
// --- components ---
import EditorToolBar from 'components/common/EditorToolBar';
// --- functions / types ---
import { createArticle } from 'api/article';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { checkCancelEdit, guardVisitorAction } from 'utils/common';
import { editorExtensions } from 'utils/tiptap';
import '../../styles/editor.scss';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ArticleCreatePage() {
  const [title, setTitle] = useState('');
  const [isContentEmpty, setIsContentEmpty] = useState(true); // 編輯器是否為空（控制發佈按鈕）
  const navigate = useNavigate();

  // Tiptap 編輯器；內容以 HTML 字串存取
  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    onUpdate: ({ editor: e }) => setIsContentEmpty(e.isEmpty),
  });

  const hasContent = !isContentEmpty;

  /** 新增文章 mutation */
  const { mutate: createArticleMutate, isPending: isLoading } = useMutation({
    mutationFn: ({ content }) => createArticle(title, content),
    onSuccess: (res) => {
      if (handleStatus(get(res, 'status')) === 2) {
        const swal = withReactContent(Swal);
        swal
          .fire({
            title: '文章已發佈',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then((result) => {
            if (result.isConfirmed) navigate('/');
          });
      } else if (handleStatus(get(res, 'status')) === 4) {
        handleApiError(res);
      } else if (handleStatus(get(res, 'status')) === 5) {
        errorAlert(get(res, 'data.message'));
      } else if (get(res, 'code') === 'ERR_NETWORK') {
        errorAlert(ERR_NETWORK_MSG);
      }
    },
    onError: () => {
      errorAlert();
    },
  });

  /** 發佈文章 */
  const handleSubmit = () => {
    if (guardVisitorAction()) return;
    // title 為後端必填欄位，空白會撞 500，前端先擋並給提示
    if (isEmpty(title.trim())) {
      errorAlert('請輸入文章標題');
      return;
    }
    const contentString = editor ? editor.getHTML() : '';
    createArticleMutate({ content: contentString });
  };

  return (
    <div className="w-full md:max-w-[600px] mx-2 sm:m-0">
      {/* header */}
      <div className="flex justify-between items-center p-2">
        <div className="hidden sm:block w-10 sm:w-24">
          <button
            aria-label="back"
            type="button"
            className="justify-center items-center p-2 text-gray-500 hover:text-orange-500 hidden sm:block"
            onClick={async () => {
              const isClose = await checkCancelEdit();
              if (isClose) window.history.back();
            }}
          >
            <FontAwesomeIcon icon={faCircleLeft} className="w-7 h-7" />
          </button>
        </div>
        <p className="text-2xl font-bold">建立文章</p>
        <div className="flex gap-2">
          {!isEmpty(title) && hasContent ? (
            <button
              type="button"
              className="flex justify-center items-center w-16 sm:w-20 h-9 p-2 sm:py-1.5 text-white rounded-md bg-green-600"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 m-1.5" />
              ) : (
                <p className="text-[14px] sm:text-[16px]">發佈</p>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-gray-600 cursor-default"
            >
              <p className="text-[14px] sm:text-[16px]">發佈</p>
            </button>
          )}
        </div>
      </div>

      {/* 文字編輯工具列 */}
      <EditorToolBar editor={editor} />
      <div className="mb-2">
        <input
          type="text"
          name="title"
          placeholder="文章標題"
          className="w-full text-2xl outline-none bg-transparent text-ink placeholder:text-muted"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div
        className="relative max-h-minus280 h-minus280 overflow-y-auto"
        onClick={() => editor?.commands.focus()}
      >
        {/* 文章內容 */}
        {!hasContent && (
          <div id="placeholder" className="absolute text-gray-500 pointer-events-none">
            從這裡開始你的故事...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default ArticleCreatePage;
