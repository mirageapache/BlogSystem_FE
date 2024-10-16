/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { get, isEmpty } from 'lodash';
import { useMutation } from 'react-query';
// --- api ---
import { updatePost } from 'api/post';
// --- functions / types ---
import { useDispatch, useSelector } from 'react-redux';
import { getCookies } from 'utils/common';
import { errorAlert, handleStatus } from 'utils/fetch';
import { handleHashTag } from 'utils/input';
// --- components ---
import { PostStateType, setShowEditModal } from '../../redux/postSlice';
import '../../styles/post.scss';
import { GRAY_BG_PANEL, WHITE_SPACER } from '../../constants/LayoutConstants';
import { ERR_NETWORK_MSG } from '../../constants/StringConstants';

interface stateType {
  post: PostStateType;
}

function PostEditModal() {
  const dispatchSlice = useDispatch();
  const postState = useSelector((state: stateType) => state.post);
  const [firstLoad, setFirstLoad] = useState(true);
  const { postId, postData } = postState;

  const [content, setContent] = useState(postData.content); // 內容
  const [hashTagArr, setHashTagArr] = useState<string[]>([]); // hash tag
  const [image, setImage] = useState(postData.image); // 處理 image preview
  const [imageFile, setImageFile] = useState<any>(null); // 處理 image file upload
  const [removeImage, setRemoveImage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // 輸入框div
  const swal = withReactContent(Swal);
  const authorId = postData.author._id;

  useEffect(() => {
    // 首次載入設定初始資料
    if (firstLoad) {
      if (contentRef.current) contentRef.current.innerHTML = postData.content;
      setFirstLoad(false);
    }
  }, []);

  /** 關閉modal */
  const handleClose = (showAlert: boolean) => {
    if (showAlert) {
      swal
        .fire({
          title: '要取消編輯嗎?',
          text: '系統將不會儲存及修改貼文',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: `取消`,
        })
        .then((result) => {
          if (result.isConfirmed) dispatchSlice(setShowEditModal(false));
        });
    } else {
      dispatchSlice(setShowEditModal(false));
    }
  };

  /** 處理上傳圖片檔 */
  const handleFileChange = (event: React.ChangeEvent<any>) => {
    const fileList = event.target.files; // 獲取選擇的檔案列表
    if (!isEmpty(fileList) && fileList?.length) {
      const file = fileList[0];
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setRemoveImage(false);
    }
  };

  /** 刪除圖片檔 */
  const handleDeleteImage = () => {
    setImage('');
    setImageFile('');
    setRemoveImage(true);
  };

  /** 處理div輸入行為 */
  const handleOnInput = () => {
    if (contentRef.current) {
      const { formattedContent, hashTags } = handleHashTag(contentRef.current.innerText);
      setContent(formattedContent);
      setHashTagArr(hashTags);
    }
  };

  /** 編輯貼文 mutation */
  const editPostMutation = useMutation(
    ({ userId, formData }: { userId: string; formData: FormData }) => updatePost(userId, formData),
    {
      onSuccess: (res) => {
        if (handleStatus(get(res, 'status')) === 2) {
          swal
            .fire({
              title: '貼文已修改',
              icon: 'success',
              confirmButtonText: '確認',
            })
            .then(() => {
              handleClose(false);
              window.location.reload();
            });
        } else if (handleStatus(get(res, 'status')) === 5) {
          errorAlert(get(res, 'data.message'));
        } else if (get(res, 'code') === 'ERR_NETWORK') {
          errorAlert(ERR_NETWORK_MSG);
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 編輯貼文 */
  const handleSubmit = () => {
    // 驗證content內容
    if (isEmpty(content) || content.length === 0) return;

    // 判斷登入操作者與作者id是否相同
    const userId = getCookies('uid') as string;
    if (userId !== authorId) {
      swal.fire({
        title: '操作異常!',
        icon: 'warning',
        confirmButtonText: '確認',
      });
      return;
    }

    // 建立FormData
    const formData = new FormData();
    formData.set('postId', postId);
    formData.set('content', content);
    formData.set('status', '1');
    formData.set('image', image);
    formData.set('imageId', postData.imageId);
    formData.set('removeImage', removeImage.toString());
    formData.set('hashTags', JSON.stringify(hashTagArr));
    formData.set('imageFile', imageFile);

    editPostMutation.mutate({ userId, formData });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="fixed w-full h-dvh rounded-lg sm:max-w-[600px] sm:h-auto bg-white dark:bg-gray-800 z-40">
        {/* modal header */}
        <div className="flex justify-between items-center w-full py-2 px-5 border-b-[1px] border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-bold">編輯貼文</h3>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={() => handleClose(true)}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="h-6 w-6 m-1 text-gray-500 hover:text-red-500"
            />
          </button>
        </div>

        {/* modal body | [h-minus120]是自訂的tailwind樣式 */}
        <div className="relative py-2 px-5 h-minus120 sm:h-auto">
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
                <img src={image} alt="postImg" className="h-24 min-w-24 object-cover" />
                <button
                  aria-label="close"
                  type="button"
                  className={`${WHITE_SPACER}`}
                  onClick={handleDeleteImage}
                >
                  <FontAwesomeIcon
                    className="absolute top-[-8px] right-[-8px] w-5 h-5 text-gray-500 hover:text-red-500 z-30"
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
                className="flex justify-center items-center w-40 sm:w-24 py-1.5 text-white rounded-md bg-green-600"
                onClick={handleSubmit}
              >
                {editPostMutation.isLoading ? (
                  <FontAwesomeIcon
                    icon={icon({ name: 'spinner', style: 'solid' })}
                    className="animate-spin h-5 w-5 "
                  />
                ) : (
                  <>確認</>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="w-40 sm:w-24 py-1.5 text-white rounded-md bg-gray-600"
              >
                確認
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={GRAY_BG_PANEL} onClick={() => handleClose(true)} />
    </div>
  );
}

export default PostEditModal;
