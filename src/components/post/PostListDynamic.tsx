import React from 'react';
import { isEmpty } from 'lodash';
// --- components ---
import PostItem from './PostItem';
import PostLoading from './PostLoading';
import PostListLoading from './PostListLoading';
// --- types ---
import { PostDataType } from '../../types/postType';

interface PropType {
  postListData: PostDataType[];
  isLoading: boolean;
  atBottom: boolean;
}

function PostListDynamic({ postListData, isLoading, atBottom }: PropType) {
  if (isLoading && isEmpty(postListData)) return <PostListLoading />;

  const postItems = postListData!.map((post) => {
    return <PostItem key={post._id} postData={post} />;
  });

  return (
    <section className="w-full">
      <div>{postItems}</div>
      {atBottom ? (
        <div className="my-5 text-center text-gray-500">- 已經沒有更多貼文了 -</div>
      ) : (
        <PostLoading withBorder={false} />
      )}
    </section>
  );
}

export default PostListDynamic;
