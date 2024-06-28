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
import { getPostDetail, updatePost } from 'api/post';
// --- functions / types ---
import { useDispatch, useSelector } from 'react-redux';
import { getCookies } from 'utils/common';
import { errorAlert } from 'utils/fetchError';
// --- components ---
import { PostStateType, setShowEditModal } from '../../redux/postSlice';

interface stateType {
  post: PostStateType;
}

function PostEditModal() {
  const dispatchSlice = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(''); // 內容
  const [image, setImage] = useState(''); // 處理 image preview
  const [imageFile, setImageFile] = useState<any>(null); // 處理 image file upload
  const contentRef = useRef<HTMLDivElement>(null); // 輸入框div
  const postState = useSelector((state: stateType) => state.post);
  const { postId } = postState;

  /** 取得貼文資料 */
  const PostDetail = async () => {
    setIsLoading(true);
    const res = await getPostDetail(postId);
    if(res.status === 200){
      const postDetail = get(res, 'data');
      if(contentRef.current) contentRef.current.innerHTML = postDetail.content;
      setContent(postDetail.content);
      setImage(postDetail.image);
    }
    setIsLoading(false);
  };

  useEffect(() => { PostDetail(); }, []);

  /** 關閉modal */
  const handleClose = () => {
    dispatchSlice(setShowEditModal(false));
  };

  /** 編輯貼文 mutation */
  const editPostMutation = useMutation(
    ({ userId, formData }: { userId: string; formData: FormData }) => updatePost(userId, formData),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          const swal = withReactContent(Swal);
          swal.fire({
            title: '貼文已修改',
            icon: 'success',
            confirmButtonText: '確認',
          });
          handleClose();
          window.location.reload();
        }
      },
      onError: () => errorAlert(),
      // error type:未登入、沒有內容
    }
  );

  /** 編輯貼文 */
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
    formData.set('hashTags', JSON.stringify([]));
    if (imageFile) formData.set('postImage', imageFile);

    editPostMutation.mutate({ userId, formData });
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
  const handleOnInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      // 因使用contenteditable方法再不同瀏覽器中渲染HTML的處理方式不同，因此須統一在每一行內容包裹在 <div> 標籤中
      const lines = contentRef.current.innerText.split('\n');
      const formattedContent = lines.map((line) => `<div>${line}</div>`).join('');
      setContent(formattedContent);
    }
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
          {isLoading ? (
            <div className="w-full h-full sm:h-80 outline-none">資料載入中</div>
          ) : (
            <div
              contentEditable
              ref={contentRef}
              className="w-full h-full sm:min-h-80 sm:max-h-70vh outline-none overflow-y-auto"
              onInput={handleOnInput}
            />
          )}

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
                確認
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
      <div className="fixed w-full h-full bg-black opacity-40" onClick={handleClose} />
    </div>
  );
}

export default PostEditModal;
