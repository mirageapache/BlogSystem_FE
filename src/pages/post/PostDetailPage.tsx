import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import _, { get, isEmpty } from 'lodash';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserInfoPanel from 'components/user/UserInfoPanel';
// --- api ---
import { getAllPosts, getPostDetail } from 'api/post';
import { formatDateTime } from 'utils/dateTime';
import PostInfoPanel from 'components/post/PostInfoPanel';
import { useSelector } from 'react-redux';
import { PostStateType } from 'redux/postSlice';
import moment from 'moment';

interface stateType {
  post: PostStateType;
}

function PostDetailPage() {
  // const postState = useSelector((state: stateType) => state.post);
  // const { postData } = postState;
  const [showCreateTip, setShowCreateTip] = useState(false); // 判斷是否顯示"建立貼文日期"提示
  const [showEditTip, setShowEditTip] = useState(false); // 判斷是否顯示"編輯貼文日期"提示

  // const { id } = useParams();
  const postId = get(window, 'location.pathname', '').split('/')[2]; // 
  const { isLoading, error, data } = useQuery('posts', () => getPostDetail(postId));
  const postData = _.get(data, 'data');
  console.log(postData);

  if (isLoading) return <p>Loading...</p>;
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
              className={"text-gray-600 dark:text-gray-300"}
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </div>

          {/* info panel */}
          <PostInfoPanel postData={postData} />
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
