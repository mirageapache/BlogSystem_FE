import React from 'react';
import ArticleLoading from 'components/article/ArticleLoading';

function ArticleListLoading() {
  const arr = [1, 2, 3, 4, 5];
  const loadingList = arr.map((item) => {
    return (
      <div
        key={`loading-${item}`}
        className="mb-4 rounded-card border border-line bg-surface shadow-card"
      >
        <ArticleLoading withBorder={false} />
      </div>
    );
  });

  return <div>{loadingList}</div>;
}

export default ArticleListLoading;
