/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { get, isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import '../../styles/tiptap.scss';
// --- components ---
import TiptapToolBar from 'components/common/TiptapToolBar';
// --- functions / types ---
import { createArticle } from 'api/article';
import { errorAlert, handleStatus } from 'utils/fetch';
import { checkCancelEdit, getCookies } from 'utils/common';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function TiptapArticleCreatePage() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

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

  /** 新增文章 mutation */
  const { mutate: createArticleMutate, isLoading } = useMutation(
    ({ userId, content }: { userId: string | undefined; content: string }) =>
      createArticle(userId!, title, content),
    {
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
        } else if (handleStatus(get(res, 'status')) === 5) {
          errorAlert(get(res, 'data.message'));
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          errorAlert(ERR_NETWORK_MSG);
        }
      },
      onError: () => {
        errorAlert();
      },
    }
  );

  /** 發佈文章 */
  const handleSubmit = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const userId = getCookies('uid');
    createArticleMutate({ userId, content });
  };

  const hasContent = !isEmpty(editor?.getText());

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
            <FontAwesomeIcon
              icon={icon({ name: 'circle-left', style: 'solid' })}
              className="w-7 h-7"
            />
          </button>
        </div>
        <p className="text-2xl font-bold">建立文章Tiptap</p>
        <div className="flex gap-2">
          {!isEmpty(title) && hasContent ? (
            <button
              type="button"
              className="flex justify-center items-center w-16 sm:w-20 h-9 p-2 sm:py-1.5 text-white rounded-md bg-green-600"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={icon({ name: 'spinner', style: 'solid' })}
                  className="animate-spin h-5 w-5 m-1.5"
                />
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
      <TiptapToolBar editor={editor} />

      <div className="mb-2">
        <input
          type="text"
          name="title"
          placeholder="文章標題"
          className="w-full text-2xl outline-none dark:text-white dark:bg-gray-950"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="relative max-h-minus280 h-minus280 overflow-y-auto">
        {/* {!hasContent && (
          <div id="placeholder" className="absolute text-gray-500">
            從這裡開始你的故事...
          </div>
        )} */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TiptapArticleCreatePage;
