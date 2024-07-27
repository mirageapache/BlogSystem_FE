/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { useRef, useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import EditorToolBar from 'components/common/EditorToolBar';
import { customStyleMap } from 'constants/CustomStyleMap';

function ArticleCreatePage() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);
  const hasContent =
    editorState.getCurrentContent().hasText() || // hasTest() 判斷Editor內是否有內容
    editorState.getCurrentContent().getBlockMap().first().getType() !== 'unstyled'; // .getBlockMap().first().getType() 判斷第一段內容的類型是否有被定義

  /** 字型樣式設定 */
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  /** 字體類型設定 */
  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  /** 發佈文章 */
  const handleSubmit = () => {};

  return (
    <div className="w-full md:max-w-[600px]">
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
        {hasContent ? (
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
      <EditorToolBar toggleInlineStyle={toggleInlineStyle} toggleBlockType={toggleBlockType} />
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
          blockStyleFn={() => ''}
          ref={editorRef}
        />
      </div>
    </div>
  );
}

export default ArticleCreatePage;
