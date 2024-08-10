import React from 'react';
import ArticleLoading from 'components/article/ArticleLoading';

function ArticleListLoading() {
  const arr = [1, 2, 3, 4, 5];
  const loadingList = arr.map((item) => {
    return (
      <div key={`loading-${item}`} className="border-b-[1px] dark:border-gray-700 last:border-b-0">
        <ArticleLoading withBorder={false} />
      </div>
    );
  });

  return <div>{loadingList}</div>;
}

export default ArticleListLoading;
