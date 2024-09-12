/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { isEmpty } from 'lodash';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
// --- api ---
import { createPost } from 'api/post';
// --- functions / types ---
import { getCookies } from 'utils/common';
import { errorAlert } from 'utils/fetchError';
import { handleHashTag } from '../../utils/input';
import { setShowCreateModal } from '../../redux/postSlice';
import { GRAY_BG_PANEL } from '../../constants/LayoutConstants';

function PostCreateModal() {
  const dispatchSlice = useDispatch();
  const [content, setContent] = useState(''); // 內容
  const [hashTagArr, setHashTagArr] = useState<string[]>([]); // hash tag
  const [image, setImage] = useState(''); // 處理 image preview
  const [imageFile, setImageFile] = useState<any>(null); // 處理 image file upload
  const contentRef = useRef<HTMLDivElement>(null); // 輸入框div

  /** 關閉modal */
  const handleClose = () => {
    dispatchSlice(setShowCreateModal(false));
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
    setImage('');
    setImageFile('');
  };

  /** 處理div輸入行為 */
  const handleOnInput = () => {
    if (contentRef.current) {
      const { formattedContent, hashTags } = handleHashTag(contentRef.current.innerText);
      setContent(formattedContent);
      setHashTagArr(hashTags);
    }
  };

  /** 新增貼文 mutation */
  const createPostMutation = useMutation(
    ({ userId, formData }: { userId: string; formData: FormData }) => createPost(userId, formData),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          const swal = withReactContent(Swal);
          swal.fire({
            title: '貼文已發佈',
            icon: 'success',
            confirmButtonText: '確認',
          });
          handleClose();
          window.location.reload();
        } else {
          errorAlert();
        }
      },
      onError: () => errorAlert(),
      // error type:未登入、沒有內容
    }
  );

  /** 發佈貼文 */
  const handleSubmit = () => {
    // validate form data
    if (isEmpty(content) || content.length === 0) {
      return;
    }
    const userId = getCookies('uid') as string;

    const formData = new FormData();
    formData.set('author', userId);
    formData.set('content', content);
    formData.set('status', '1');
    formData.set('image', image);
    formData.set('hashTags', JSON.stringify(hashTagArr));
    if (imageFile) formData.set('imageFile', imageFile);

    createPostMutation.mutate({ userId, formData });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="fixed w-full h-dvh rounded-lg sm:max-w-[600px] sm:h-auto bg-white dark:bg-gray-800 z-40">
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
          {/* contenteditable功能 */}
          <div
            id="edit-container"
            contentEditable
            ref={contentRef}
            className="w-full h-minus240 sm:h-auto sm:min-h-80 sm:max-h-70vh outline-none overflow-y-auto"
            onInput={handleOnInput}
          />

          {/* image preview */}
          {!isEmpty(image) && (
            <div className="flex w-full h-24 overflow-y-hidden overflow-x-auto border-gray-400 border-t-[1px] pt-2">
              <div className="relative">
                <img src={image} alt="" className="h-24 object-cover" />
                <button aria-label="close" type="button" onClick={handleDeleteImage}>
                  <FontAwesomeIcon
                    className="absolute top-1 right-1 w-5 h-5 text-gray-500 hover:text-red-500"
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
            {!isEmpty(content) || content.length !== 0 ? (
              <button
                type="button"
                className="w-40 sm:w-24 py-1.5 text-white rounded-md bg-green-600"
                onClick={handleSubmit}
              >
                {createPostMutation.isLoading ? (
                  <FontAwesomeIcon
                    icon={icon({ name: 'spinner', style: 'solid' })}
                    className="animate-spin h-5 w-5 "
                  />
                ) : (
                  <>發佈</>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="w-40 sm:w-24 py-1.5 text-white rounded-md bg-gray-600"
              >
                發佈
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={GRAY_BG_PANEL} onClick={handleClose} />
    </div>
  );
}

export default PostCreateModal;
