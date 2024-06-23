/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { getCookies } from 'utils/common';
import { useMutation } from 'react-query';
import { createPost } from 'api/post';
import { PostVariablesType } from 'types/postType';
import { errorAlert } from 'utils/fetchError';
import { setShowCreateModal } from '../../redux/postSlice';

function PostCreateModal() {
  const dispatchSlice = useDispatch();
  const [content, setContent] = useState(''); // 內容
  const [image, setImage] = useState(''); // 處理 image preview
  const [imageFile, setImageFile] = useState<any>(null); // 處理 image file upload

  /** 關閉modal */
  const handleClose = () => {
    dispatchSlice(setShowCreateModal(false));
  };

  /** 新增貼文 mutation */
  const createPostMutation = useMutation((variables: PostVariablesType) => createPost(variables), {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res);
        handleClose();
      }
    },
    onError: () => errorAlert(),
  });

  /** 發佈貼文 */
  const handleSubmit = () => {
    const userId = getCookies('uid') as string;
    const variables: PostVariablesType = {
      userId,
      content,
      status: 1,
    };
    console.log(variables);
    createPostMutation.mutate(variables);
  };

  /** 處理上傳圖片檔 */
  const handleFileChange = (event: React.ChangeEvent<any>) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  /** 刪除圖片檔 */
  const handleDeleteImage = () => {
    console.log('delete image');
  };

  // 測試contenteditable功能
  // const getCaretPosition = (element: any) => {
  //   let caretOffset = 0;
  //   const doc = element.ownerDocument || element.document;
  //   const win = doc.defaultView || doc.parentWindow;
  //   const sel = win.getSelection();
  //   if (sel.rangeCount > 0) {
  //     const range = sel.getRangeAt(0);
  //     const preCaretRange = range.cloneRange();
  //     preCaretRange.selectNodeContents(element);
  //     preCaretRange.setEnd(range.endContainer, range.endOffset);
  //     caretOffset = preCaretRange.toString().length;
  //   }
  //   return caretOffset;
  // };

  // const setCaretPosition = (element: any, offset: any) => {
  //   const doc = element.ownerDocument || element.document;
  //   const win = doc.defaultView || doc.parentWindow;
  //   const sel = win.getSelection();
  //   if (sel.rangeCount > 0) {
  //     sel.removeAllRanges();
  //   }
  //   const range = doc.createRange();
  //   range.setStart(element.childNodes[0], offset);
  //   range.collapse(true);
  //   sel.addRange(range);
  // };

  // const handleOnInput = (e: any) => {
  //   const caretPosition = getCaretPosition(e.target);
  //   setContent(e.target.innerText);
  //   setTimeout(() => setCaretPosition(e.target, caretPosition), 0);
  // };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="fixed w-full h-dvh rounded-lg sm:max-w-[600px] sm:h-auto sm:max-h-[600px] bg-white dark:bg-gray-800 z-40">
        {/* modal header */}
        <div className="flex justify-between items-center w-full py-2 px-5 border-b-[1px] border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-bold">建立貼文</h3>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="h-6 w-6 m-1 text-gray-500 hover:text-red-500"
            />
          </button>
        </div>

        {/* modal body | [h-minus120]是自訂的tailwind樣式 */}
        <div className="relative py-2 px-5 h-minus120 sm:h-auto">
          <textarea
            name="content"
            className="w-full h-minus240 sm:h-80 resize-none outline-none dark:bg-gray-800"
            placeholder="告訴大家你的想法..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* 測試contenteditable功能
          <div
            contentEditable
            id="postContentInput"
            className="w-full h-full sm:h-80 outline-none"
            onInput={handleOnInput}
          >
            {content}
          </div> */}

          {/* image preview */}
          {!isEmpty(image) && (
            <div className="flex w-full h-24 overflow-y-hidden overflow-x-auto border-gray-400 border-t-[1px] pt-2">
              <div className="relative">
                <img src={image} alt="" className="h-24 object-cover" />
                <button aria-label="close" type="button" onClick={handleDeleteImage}>
                  <FontAwesomeIcon
                    className="absolute top-1 right-1 w-5 h-5 text-gray-700 hover:text-red-500"
                    icon={icon({ name: 'circle-xmark', style: 'solid' })}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* modal footer */}
        <div className="fixed w-full bottom-0 sm:relative sm:bottom-auto flex justify-between py-3 px-5 text-right border-t-[1px] border-gray-300 dark:border-gray-700">
          <div>
            <label htmlFor="postImage">
              <FontAwesomeIcon
                icon={icon({ name: 'image', style: 'solid' })}
                className="h-6 w-6 m-1 cursor-pointer text-gray-500 hover:text-orange-500"
              />
            </label>
            <input
              id="postImage"
              className="hidden"
              name="postImage"
              type="file"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <div>
            <button
              type="button"
              className="w-24 py-1.5 hidden sm:inline-block mr-6 text-white rounded-md bg-gray-500"
              onClick={handleClose}
            >
              取消
            </button>
            <button
              type="button"
              className="w-40 sm:w-24 py-1.5 text-white rounded-md bg-green-600"
              onClick={handleSubmit}
            >
              發佈貼文
            </button>
          </div>
        </div>
      </div>
      <div className="fixed w-full h-full bg-black opacity-40" onClick={handleClose} />
    </div>
  );
}

export default PostCreateModal;
