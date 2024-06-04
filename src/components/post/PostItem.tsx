import React from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { PostDataType } from 'types/postType';
import UserInfoPanel from 'components/user/UserInfoPanel';

function PostTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-3">
      <a href="/" className="font-bold">
        {text.toUpperCase()}
      </a>
    </span>
  );
}

function PostItem(props: { postData: PostDataType }) {
  const { postData } = props;

  const tagsList = postData.hashTags.map((tag) => (
    <PostTag key={`${tag}_${postData._id}`} text={tag} />
  ));

  return (
    <div className="text-left border-b-[1px] dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="flex">
        {/* <div className="mr-3"></div> */}
        <div className="">
          <div className="flex">
            <UserInfoPanel
              account={postData.author.account}
              name={postData.author.name}
              avatarUrl={postData.author.avatar}
              bgColor={postData.author.bgColor}
              className="my-2"
            />
            <p className="text-gray-600 dark:text-gray-300 my-1">{postData.createdAt}</p>
          </div>
          <div>
            <h2 className="font-semibold text-2xl xl:text-3xl">
              <Link to={`/post/${postData._id}`}>{postData.title}</Link>
            </h2>
            <div className="text-orange-500">{tagsList}</div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{postData.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
