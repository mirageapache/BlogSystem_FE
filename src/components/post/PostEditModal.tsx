/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import { faCircleXmark, faImage, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// --- api ---
import { updatePost } from 'api/post';
// --- functions / types ---
import { useDispatch, useSelector } from 'react-redux';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { guardVisitorAction } from 'utils/common';
import { handleHashTag } from 'utils/input';
// --- components ---
// --- components ---
import { UserStateType } from '../../redux/userSlice';
import { PostStateType, setShowEditModal } from '../../redux/postSlice';
import '../../styles/post.scss';
import { GRAY_BG_PANEL, WHITE_SPACER, BTN_PRIMARY } from '../../constants/LayoutConstants';
import { ERR_NETWORK_MSG } from '../../constants/StringConstants';

interface stateType {
  post: PostStateType;
  user: UserStateType;
}

function PostEditModal() {
  const dispatchSlice = useDispatch();
  const queryClient = useQueryClient();
  const postState = useSelector((state: stateType) => state.post);
  const userId = useSelector((state: stateType) => state.user.userData?.userId) as string;
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
  const editPostMutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(formData),
    onSuccess: (res) => {
      if (handleStatus(get(res, 'status')) === 2) {
        // 將四個頁面的貼文列表快取標為過期，讓各頁下次顯示時自動重新向後端拉取最新資料
        ['homepagePost', 'explorePost', 'exploreHashTag', 'profilePost', 'postDetail'].forEach(
          (key) => queryClient.invalidateQueries({ queryKey: [key] })
        );
        swal
          .fire({
            title: '貼文已修改',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            handleClose(false);
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

  /** 編輯貼文 */
  const handleSubmit = () => {
    // 驗證content內容
    if (isEmpty(content) || content.length === 0) return;
    if (guardVisitorAction()) return;

    // 判斷登入操作者與作者id是否相同
    if (userId !== authorId) {
      swal.fire({
        title: '操作異常!',
        icon: 'warning',
        confirmButtonText: '確認',
      });
      return;
    }

    // 建立FormData
    // 後端不再採信 body 的 image / imageId；圖片變更只認 imageFile（換圖）或 removeImage（移除）
    const formData = new FormData();
    formData.set('postId', postId);
    formData.set('content', content);
    formData.set('status', '1');
    formData.set('removeImage', removeImage.toString());
    formData.set('hashTags', JSON.stringify(hashTagArr));
    // 只有真的選了新檔案才 append；避免 null 被序列化為字串 "null"
    if (imageFile instanceof File) formData.set('imageFile', imageFile);

    editPostMutation.mutate(formData);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="animate-pop-in fixed w-full h-dvh sm:rounded-card sm:max-w-[600px] sm:h-auto bg-surface sm:border sm:border-line sm:shadow-pop z-40">
        {/* modal header */}
        <div className="flex justify-between items-center w-full py-2 px-5 border-b border-line">
          <h3 className="text-xl font-bold text-ink">編輯貼文</h3>
          <button
            aria-label="close"
            type="button"
            className="flex justify-center m-1"
            onClick={() => handleClose(true)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-6 w-6 m-1 text-muted hover:text-ink transition-colors"
            />
          </button>
        </div>

        {/* modal body | [h-minus120]是自訂的tailwind樣式 */}
        <div className="relative py-2 px-5 h-minus120 sm:h-auto">
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
                <img src={image} alt="postImg" className="h-24 min-w-24 object-cover rounded-md" />
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
              disabled={isEmpty(content) || editPostMutation.isPending}
              className={`${BTN_PRIMARY} w-40 sm:w-24 py-1.5 rounded-full`}
              onClick={handleSubmit}
            >
              {editPostMutation.isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 " />
              ) : (
                <>確認</>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={GRAY_BG_PANEL} onClick={() => handleClose(true)} />
    </div>
  );
}

export default PostEditModal;
