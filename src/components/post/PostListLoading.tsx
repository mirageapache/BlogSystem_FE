import React from 'react';
import PostLoading from 'components/post/PostLoading';

function PostListLoading() {
  const arr = [1, 2, 3, 4, 5];
  const loadingList = arr.map((item) => {
    return (
      <div
        key={`loading-${item}`}
        className="border-b-[1px] dark:border-gray-700 py-4 last:border-b-0"
      >
        <PostLoading withBorder={false} />
      </div>
    );
  });

  return <div>{loadingList}</div>;
}

export default PostListLoading;
