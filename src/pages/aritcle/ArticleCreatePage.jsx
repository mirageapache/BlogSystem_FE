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
import EditorToolBar from 'components/common/EditorToolBar';
import { BTN_PRIMARY } from 'constants/LayoutConstants';
import { ARTICLE_STATUS, ERR_NETWORK_MSG } from 'constants/StringConstants';
import { createArticle } from 'api/article';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { checkCancelEdit, guardVisitorAction } from 'utils/common';
import { editorExtensions } from 'utils/tiptap';
import '../../styles/editor.scss';

function ArticleCreatePage() {
  const [title, setTitle] = useState('');
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    onUpdate: ({ editor: e }) => setIsContentEmpty(e.isEmpty),
  });

  const hasContent = !isContentEmpty;

  const { mutate: createArticleMutate, isPending: isLoading } = useMutation({
    mutationFn: ({ content, status }) => createArticle(title, content, status),
    onSuccess: (res, { status }) => {
      if (handleStatus(get(res, 'status')) === 2) {
        const swal = withReactContent(Swal);
        const isDraft = status === ARTICLE_STATUS.DRAFT;
        swal
          .fire({
            title: isDraft ? '草稿已儲存' : '文章已發佈',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then((result) => {
            if (result.isConfirmed) navigate(isDraft ? '/my-articles' : '/');
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

  const handleSubmit = (status) => {
    if (guardVisitorAction()) return;
    if (isEmpty(title.trim())) {
      errorAlert('請輸入文章標題');
      return;
    }
    createArticleMutate({ content: editor ? editor.getHTML() : '', status });
  };

  const canPublish = !isEmpty(title) && hasContent;
  const canDraft = !isEmpty(title);

  return (
    <div className="w-full max-w-4xl mx-2 sm:m-0">
      {/* header */}
      <div className="flex justify-between items-center p-2">
        <div className="hidden sm:block w-10 sm:w-24">
          <button
            aria-label="back"
            type="button"
            className="justify-center items-center p-2 text-muted hover:text-brand transition-colors hidden sm:block"
            onClick={async () => {
              const isClose = await checkCancelEdit();
              if (isClose) window.history.back();
            }}
          >
            <FontAwesomeIcon icon={faCircleLeft} className="w-7 h-7" />
          </button>
        </div>
        <p className="font-serif text-2xl font-bold">建立文章</p>
        <div className="flex gap-2">
          {/* 儲存草稿 */}
          {canDraft ? (
            <button
              type="button"
              className="flex justify-center items-center w-20 sm:w-24 h-9 px-2 rounded-md border border-line text-ink hover:bg-surface-2 transition-colors text-[13px] sm:text-[15px]"
              onClick={() => handleSubmit(ARTICLE_STATUS.DRAFT)}
              disabled={isLoading}
            >
              儲存草稿
            </button>
          ) : (
            <button
              type="button"
              className="flex justify-center items-center w-20 sm:w-24 h-9 px-2 rounded-md bg-surface-2 text-muted cursor-not-allowed text-[13px] sm:text-[15px]"
              disabled
            >
              儲存草稿
            </button>
          )}
          {/* 發佈 */}
          {canPublish ? (
            <button
              type="button"
              className={`${BTN_PRIMARY} w-16 sm:w-20 h-9 p-2 sm:py-1.5 rounded-md`}
              onClick={() => handleSubmit(ARTICLE_STATUS.PUBLIC)}
              disabled={isLoading}
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
              className="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 rounded-md bg-surface-2 text-muted cursor-not-allowed"
              disabled
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
          className="w-full text-2xl outline-none focus-visible:outline-none bg-transparent text-ink placeholder:text-muted"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div
        className="relative max-h-minus280 h-minus280 overflow-y-auto"
        onClick={() => editor?.commands.focus()}
      >
        {!hasContent && (
          <div id="placeholder" className="absolute text-muted pointer-events-none">
            從這裡開始你的故事...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default ArticleCreatePage;
