/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import '../../styles/post.scss';
// --- components ---
import PostInfoPanel from 'components/post/PostInfoPanel';
import UserInfoPanel from 'components/user/UserInfoPanel';
// --- functions / types ---
import { formatDateTime } from 'utils/dateTime';
import { PostDataType } from 'types/postType';

function PostItem(props: { postData: PostDataType }) {
  const { postData } = props;
  const [showCreateTip, setShowCreateTip] = useState(false); // 判斷是否顯示"建立貼文日期"提示
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文日期"提示
  const contentArr = postData.content.match(/<div.*?<\/div>/g); // 將字串內容轉換成陣列
  const contentLength = isEmpty(contentArr) ? 0 : contentArr!.length; // 貼文內容長度(行數)
  const [hiddenContent, setHiddenContent] = useState(contentLength > 10 || false); // 是否隱藏貼文內容(預設顯示10行，過長的部分先隱藏)

  return (
    <div className="flex text-left border-b-[1px] dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="w-full">
        <div className="flex justify-between">
          <UserInfoPanel
            userId={postData.author._id}
            account={postData.author.account}
            name={postData.author.name}
            avatarUrl={postData.author.avatar}
            bgColor={postData.author.bgColor}
            className="my-2"
          />
          <div className="flex flex-col justify-center items-end">
            <span
              className="relative my-0.5"
              onMouseEnter={() => setShowCreateTip(true)}
              onMouseLeave={() => setShowCreateTip(false)}
            >
              <p className="text-gray-600 dark:text-gray-300">
                {formatDateTime(postData.createdAt)}
              </p>
              <span
                className={`absolute top-[-25px] right-0 w-40 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
                  showCreateTip ? 'block' : 'hidden'
                }`}
              >
                Created at {moment(postData.createdAt).format('MMMM Do YYYY, h:mm:ss')}
              </span>
            </span>
            {!isEmpty(postData.editedAt) && (
              <span
                className="relative my-0.5"
                onMouseEnter={() => setShowEditTip(true)}
                onMouseLeave={() => setShowEditTip(false)}
              >
                <small className="text-gray-400">(已編輯)</small>
                <span
                  className={`absolute right-0 w-40 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
                    showEditTip ? 'block' : 'hidden'
                  }`}
                >
                  Edited at {moment(postData.editedAt).format('MMMM Do YYYY, h:mm:ss')}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="sm:ml-[60px]">
          {/* image */}
          {!isEmpty(postData.image) && (
            <div className="w-full">
              <img className="w-full rounded-md" src={postData.image} alt="postImage" />
            </div>
          )}

          {/* content */}
          <div className="my-2">
            <div
              id="post-container"
              className={`text-gray-600 dark:text-gray-300 ${
                hiddenContent ? 'line-clamp-[10]' : ''
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
