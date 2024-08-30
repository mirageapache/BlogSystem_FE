import React, { useRef } from 'react';
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
  const loadingBar = useRef(null); // 判斷是否進行載入新資料(refetch)

  if (isLoading && isEmpty(postListData)) return <PostListLoading />;

  const postItems = postListData!.map((post) => {
    return <PostItem key={post._id} postData={post} />;
  });

  return (
    <section className="w-full">
      <div>{postItems}</div>
      <div ref={loadingBar} />
      {atBottom ? (
        <div className="text-center">已經沒有更多貼文資料了</div>
      ) : (
        <PostLoading withBorder={false} />
      )}
    </section>
  );
}

export default PostListDynamic;
