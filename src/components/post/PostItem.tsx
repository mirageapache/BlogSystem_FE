/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import PostInfoPanel from 'components/post/PostInfoPanel';
import UserInfoPanel from 'components/user/UserInfoPanel';
// --- functions / types ---
import { formatDateTime } from 'utils/dateTime';
import { getCookies } from 'utils/common';
import { PostDataType } from 'types/postType';
import { useDispatch } from 'react-redux';
import { setPostId, setShowEditModal } from '../../redux/postSlice';

function PostTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-1">
      <Link to="/" className="text-sky-600">
        #{text}
      </Link>
    </span>
  );
}

function PostItem(props: { postData: PostDataType }) {
  const { postData } = props;
  const userId = getCookies('uid');
  const [showEditTip, setShowEditTip] = useState(false);
  const dispatchSlice = useDispatch();
  console.log(moment(postData.createdAt).unix().toString());

  const tagsList = postData.hashTags.map((tag) => (
    <PostTag key={`${tag}_${postData._id}`} text={tag} />
  ));

  /** 處理編輯貼文按鈕 */
  const handleClickEdit = () => {
    dispatchSlice(setPostId(postData._id));
    dispatchSlice(setShowEditModal(true));
  };

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
          <div className="flex gap-4 py-1">
            <p className="text-gray-600 dark:text-gray-300">{formatDateTime(postData.createdAt)}</p>

            {userId === postData.author._id && (
              <span
                className="relative my-0.5"
                onMouseEnter={() => setShowEditTip(true)}
                onMouseLeave={() => setShowEditTip(false)}
              >
                <button type="button" className="text-gray-500 hover:text-orange-500 rounded-md">
                  <FontAwesomeIcon
                    icon={icon({ name: 'square-pen', style: 'solid' })}
                    className="w-5 h-5"
                  />
                </button>
                <span
                  className={`absolute right-0 w-20 text-center text-sm p-1 rounded-lg opacity-90 bg-black text-white dark:bg-white dark:text-black ${
                    showEditTip ? 'block' : 'hidden'
                  }`}
                  onClick={handleClickEdit}
                >
                  編輯貼文
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
              className="text-gray-600 dark:text-gray-300 line-clamp-[10]"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </div>

          {/* hash tags */}
          <div>{tagsList}</div>

          {/* info panel */}
          <PostInfoPanel postData={postData} />
        </div>
      </div>
    </div>
  );
}

export default PostItem;
