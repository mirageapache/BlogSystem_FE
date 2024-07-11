/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserInfoPanel from 'components/user/UserInfoPanel';
import PostLoading from 'components/post/PostLoading';
// --- api ---
import { getPostDetail } from 'api/post';
import { formatDateTime } from 'utils/dateTime';
import PostInfoPanel from 'components/post/PostInfoPanel';

function PostDetailPage() {
  const [showCreateTip, setShowCreateTip] = useState(false); // 判斷是否顯示"建立貼文日期"提示
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文日期"提示

  const { id } = useParams();
  const { isLoading, error, data } = useQuery('posts', () => getPostDetail(id!));
  const postData = get(data, 'data');

  if (isLoading) return <PostLoading withBorder={false} />;
  if (error) return <p>Error</p>;
  if (isEmpty(postData))
    return (
      <NoSearchResult
        msgOne="該貼文資料不存在或已刪除"
        msgTwo="無法瀏覽內容，請重新操作"
        type="post"
      />
    );

  return (
    <div className="border-b-[1px] dark:border-gray-700 cursor-default">
      <div className="flex items-center my-3">
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
      <div className="w-minus50 sm:w-full">
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
        <div className="sm:ml-[60px] border-b-[1px] border-gray-300 dark:border-gray-700 pb-3">
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
              className="text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </div>

          {/* info panel */}
          <PostInfoPanel postData={postData} />

          <div className="flex justify-between mt-3">
            <input
              type="text"
              className="w-full mr-2 px-2 outline-none bg-gray-100 dark:bg-gray-800"
              placeholder="留言..."
            />
            <button
              aria-label="reply"
              type="button"
              className="w-16 p-0.5 bg-green-600 rounded-md text-white"
            >
              回覆
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
