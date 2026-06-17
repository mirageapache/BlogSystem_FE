import React from 'react';
import PostLoading from 'components/post/PostLoading';

function PostListLoading() {
  const arr = [1, 2, 3, 4, 5];
  const loadingList = arr.map((item) => {
    return (
      <div
        key={`loading-${item}`}
        className="mb-4 rounded-card border border-line bg-surface shadow-card"
      >
        <PostLoading withBorder={false} />
      </div>
    );
  });

  return <div>{loadingList}</div>;
}

export default PostListLoading;
