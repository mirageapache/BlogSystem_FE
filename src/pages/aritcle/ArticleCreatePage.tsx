import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import EditorToolBar from 'components/common/EditorToolBar';

function ArticleCreatePage() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  /** 字型樣式設定 */
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  /** 發佈文章 */
  const handleSubmit = () => {};

  return (
    <div className="w-full md:max-w-[600px]">
      {/* header */}
      <div className="flex justify-between items-center p-2">
        <div className="w-20 sm:w-28">
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
        <div className="">
          {!isEmpty(editorState) ? (
            <button
              type="button"
              className="w-20 sm:w-28 py-1.5 text-white rounded-md bg-green-600"
              onClick={handleSubmit}
            >
              發佈
            </button>
          ) : (
            <button type="button" className="w-20 sm:w-28 py-1.5 text-white rounded-md bg-gray-600">
              發佈
            </button>
          )}
        </div>
      </div>

      <div className="max-h-minus180 h-minus180 overflow-y-auto">
        {/* 文字編輯工具列 */}
        {/* 字體、粗體、斜體、底線、刪除線、文字顏色、醒目提示顏色、對齊(左中右) */}
        <EditorToolBar toggleInlineStyle={toggleInlineStyle} />

        {/* 文章內容 */}
        <Editor
          editorState={editorState} 
          onChange={setEditorState}
          placeholder="從這裡開始你的故事..."
          blockStyleFn={() => ''}
        />
      </div>
    </div>
  );
}

export default ArticleCreatePage;
