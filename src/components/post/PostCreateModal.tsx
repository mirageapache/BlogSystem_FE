/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import { faCircleXmark, faImage, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
// --- api ---
import { createPost } from 'api/post';
// --- functions / types ---
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { guardVisitorAction } from 'utils/common';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';
import { handleHashTag } from '../../utils/input';
import { setShowCreateModal } from '../../redux/postSlice';
import { GRAY_BG_PANEL, WHITE_SPACER, BTN_PRIMARY } from '../../constants/LayoutConstants';

function PostCreateModal() {
  const dispatchSlice = useDispatch();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(''); // 內容
  const [hashTagArr, setHashTagArr] = useState<string[]>([]); // hash tag
  const [image, setImage] = useState(''); // 處理 image preview
  const [imageFile, setImageFile] = useState<any>(null); // 處理 image file upload
  const contentRef = useRef<HTMLDivElement>(null); // 輸入框div

  /** 關閉modal */
  const handleClose = () => {
    dispatchSlice(setShowCreateModal(false));
  };

  /** 處理欲上傳圖片檔 */
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
  const createPostMutation = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: (res) => {
      if (handleStatus(get(res, 'status')) === 2) {
        const swal = withReactContent(Swal);
        // 失效所有貼文列表 cache，新貼文自動拉回
        ['homepagePost', 'explorePost', 'exploreHashTag', 'profilePost'].forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        );
        swal
          .fire({
            title: '貼文已發佈',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            handleClose();
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

  /** 發佈貼文 */
  const handleSubmit = async () => {
    // validate form data
    if (isEmpty(content) || content.length === 0) {
      return;
    }
    if (guardVisitorAction()) return;

    const formData = new FormData();
    formData.set('content', content);
    formData.set('status', '1');
    formData.set('image', image);
    formData.set('hashTags', JSON.stringify(hashTagArr));
    if (imageFile instanceof File) formData.set('imageFile', imageFile);

    createPostMutation.mutate(formData);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="animate-pop-in fixed w-full h-dvh sm:rounded-card sm:max-w-[600px] sm:h-auto bg-surface sm:border sm:border-line sm:shadow-pop z-40">
        {/* modal header */}
        <div className="flex justify-between items-center w-full py-2 px-5 border-b border-line">
          <h3 className="text-xl font-bold text-ink">建立貼文</h3>
          <button
            aria-label="close"
            type="button"
            className="flex justify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-6 w-6 m-1 text-muted hover:text-ink transition-colors"
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
            className="w-full h-minus240 sm:h-auto sm:min-h-80 sm:max-h-70vh outline-none overflow-y-auto text-ink"
            onInput={handleOnInput}
          />

          {/* image preview */}
          {!isEmpty(image) && (
            <div className="flex w-full h-24 overflow-y-hidden overflow-x-auto border-line border-t pt-2">
              <div className="relative">
                <img src={image} alt="" className="h-24 object-cover rounded-md" />
                <button
                  aria-label="close"
                  type="button"
                  className={`${WHITE_SPACER}`}
                  onClick={handleDeleteImage}
                >
                  <FontAwesomeIcon
                    className="absolute top-[-8px] right-[-8px] w-5 h-5 text-muted hover:text-red-500 transition-colors z-30"
                    icon={faCircleXmark}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* modal footer */}
        <div className="fixed w-full bottom-0 sm:relative sm:bottom-auto flex justify-between items-center py-3 px-5 text-right bg-surface border-t border-line sm:rounded-b-card">
          <div>
            <label htmlFor="postImage">
              <FontAwesomeIcon
                icon={faImage}
                className="h-6 w-6 m-1 cursor-pointer text-muted hover:text-brand transition-colors"
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
              disabled={isEmpty(content) || createPostMutation.isPending}
              className={`${BTN_PRIMARY} w-40 sm:w-24 py-1.5 rounded-full`}
              onClick={handleSubmit}
            >
              {createPostMutation.isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 " />
              ) : (
                <>發佈</>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={GRAY_BG_PANEL} onClick={handleClose} />
    </div>
  );
}

export default PostCreateModal;
