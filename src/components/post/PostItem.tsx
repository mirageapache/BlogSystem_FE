/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../styles/post.scss';
// --- functions / types ---
import { HINT_LABEL } from '../../constants/LayoutConstants';
import { errorAlert, handleStatus } from '../../utils/fetch';
import { deletePost } from '../../api/post';
import { getCookies } from '../../utils/common';
import { formatDateTime } from '../../utils/dateTime';
import { PostDataType } from '../../types/postType';
import { setPostData, setPostId } from '../../redux/postSlice';
// --- components ---
import UserInfoPanel from '../user/UserInfoPanel';
import PostInfoItem from './PostInfoItem';
import PostInfoPanel from './PostInfoPanel';

function PostItem(props: { postData: PostDataType }) {
  const { postData } = props;
  const dispatchSlice = useDispatch();
  const navigate = useNavigate();
  const currentUserId = getCookies('uid');
  const [showCreateTip, setShowCreateTip] = useState(false); // 判斷是否顯示"建立貼文日期"提示
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文日期"提示
  const contentArr = postData.content.match(/<div.*?<\/div>/g); // 將字串內容轉換成陣列
  const contentLength = isEmpty(contentArr) ? 0 : contentArr!.length; // 貼文內容長度(行數)
  const [hiddenContent, setHiddenContent] = useState(contentLength > 10 || false); // 是否隱藏貼文內容(預設顯示10行，過長的部分先隱藏)
  const swal = withReactContent(Swal);
  const iscurrentUser = !isEmpty(currentUserId) && postData.author._id === currentUserId;
  const path = window.location.pathname;

  /** 點選貼文 */
  const handleClickPost = () => {
    dispatchSlice(setPostId(postData._id));
    dispatchSlice(setPostData(postData));
    navigate(`/post/${postData._id}`); // 導到詳細頁
  };

  /** 刪除貼文 mutation */
  const deleteMutation = useMutation(() => deletePost(postData._id, currentUserId!), {
    onSuccess: (res) => {
      if (handleStatus(get(res, 'status', 0)) === 2) {
        swal
          .fire({
            title: '已刪除貼文',
            icon: 'info',
            confirmButtonText: '確認',
          })
          .then(() => {
            window.location.reload();
          });
      }
    },
    onError: () => errorAlert(),
  });

  /** 刪除貼文 */
  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (iscurrentUser) {
      swal
        .fire({
          title: '確定要刪除此貼文嗎？',
          text: '確定後會立即刪除貼文',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: `取消`,
        })
        .then((result) => {
          if (result.isConfirmed) deleteMutation.mutate();
        });
    }
  };

  return (
    <div className="flex text-left border-b-[1px] dark:border-gray-700 p-3 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="w-full" onClick={handleClickPost}>
        <div className="flex justify-between">
          <UserInfoPanel
            userId={postData.author._id}
            account={postData.author.account}
            name={postData.author.name}
            avatarUrl={postData.author.avatar}
            bgColor={postData.author.bgColor}
            className="my-2"
          />
          <div className="flex">
            <div className="flex flex-col justify-start items-end mr-2">
              <span
                className="relative"
                onMouseEnter={() => setShowCreateTip(true)}
                onMouseLeave={() => setShowCreateTip(false)}
              >
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {formatDateTime(postData.createdAt)}
                </p>
                <span
                  className={`top-[-25px] right-0 w-40 ${HINT_LABEL} ${showCreateTip ? 'block' : 'hidden'}`}
                >
                  Created at {moment(postData.createdAt).format('MMMM Do YYYY, h:mm:ss')}
                </span>
              </span>
              {!isEmpty(postData.editedAt) && (
                <span
                  className="relative"
                  onMouseEnter={() => setShowEditTip(true)}
                  onMouseLeave={() => setShowEditTip(false)}
                >
                  <small className="text-gray-400">(已編輯)</small>
                  <span
                    className={`right-0 w-40 ${HINT_LABEL} ${showEditTip ? 'block' : 'hidden'}`}
                  >
                    Edited at {moment(postData.editedAt).format('MMMM Do YYYY, h:mm:ss')}
                  </span>
                </span>
              )}
            </div>
            {iscurrentUser && path.includes('/profile') && (
              <PostInfoItem
                iconName={faTrashCan} // 透過props傳遞icon名稱
                tipText="刪除"
                count={undefined}
                faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
                tipClass="w-12"
                handleClick={handleDelete}
              />
            )}
          </div>
        </div>
        <div className="sm:ml-[60px] px-2">
          {/* image */}
          {!isEmpty(postData.image) && (
            <div className="">
              <img
                className="w-full max-h-[500px] object-contain rounded-md"
                src={postData.image}
                alt="postImage"
              />
            </div>
          )}

          {/* content */}
          <div className="my-2">
            <div
              id="post-container"
              className={`text-gray-600 dark:text-gray-300 ${
                hiddenContent ? 'max-h-[300px] line-clamp-[10]' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
            {hiddenContent && (
              <button type="button" onClick={() => setHiddenContent(false)}>
                顯示更多
              </button>
            )}
          </div>

          {/* info panel */}
          <PostInfoPanel postData={postData} />
        </div>
      </div>
    </div>
  );
}

export default PostItem;
