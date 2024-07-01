import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import _, { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserInfoPanel from 'components/user/UserInfoPanel';
// --- api ---
import { getAllPosts } from 'api/post';
import { formatDateTime } from 'utils/dateTime';
import PostInfoPanel from 'components/post/PostInfoPanel';

function PostDetailPage() {
  const { isLoading, error, data } = useQuery('posts', () => getAllPosts());
  const postData = _.get(data, 'data');

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
    <div className="flex flex-col w-full my-5">
      <div className="flex flex-col w-full">
        <div className="w-full">
          {/* Author Info */}
          <div className="flex justify-between">
            <UserInfoPanel
              userId={postData.author._id}
              account={postData.author.account}
              name={postData.author.name}
              avatarUrl={postData.author.avatar}
              bgColor={postData.author.bgColor}
              className="my-2"
            />
            <p className="text-gray-600 dark:text-gray-300 my-1">
              {formatDateTime(postData.createdAt)}
            </p>
          </div>
          {/* Post Info */}
          <div className="py-2 mb-5 flex justify-between border-b-[1px] dark:border-gray-700">
            {/* image */}
            {!isEmpty(postData.image) && (
              <div>
                <img src={postData.image} alt="postImage" />
              </div>
            )}

            {/* content */}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{postData.content}</p>

            {/* hash tags */}
            {/* <div>{tagsList}</div> */}

            {/* info panel */}
            <PostInfoPanel postData={postData} />
          </div>
        </div>
        <div className="w-full">{postData.content}</div>
      </div>
    </div>
  );
}

export default PostDetailPage;
