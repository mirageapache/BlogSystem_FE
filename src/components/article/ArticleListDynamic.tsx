import React from 'react';
import { isEmpty } from 'lodash';
// --- components ---
// import ArticleItem from './ArticleItem';
import TiptapArticleItem from './TiptapArticleItem';
import ArticleLoading from './ArticleLoading';
import ArticleListLoading from './ArticleListLoading';
// --- types ---
import { ArticleDataType } from '../../types/articleType';

interface PropType {
  articleListData: ArticleDataType[];
  isLoading: boolean;
  atBottom: boolean;
}

function ArticleListDynamic({ articleListData, isLoading, atBottom }: PropType) {
  if (isLoading && isEmpty(articleListData)) return <ArticleListLoading />;

  const articleItems = articleListData!.map((article) => {
    return <TiptapArticleItem key={article._id} articleData={article} />;
  });

  return (
    <section className="w-full">
      <div>{articleItems}</div>
      {atBottom ? (
        <div className="my-5 text-center text-gray-500">- 已經沒有更多文章了 -</div>
      ) : (
        <ArticleLoading withBorder={false} />
      )}
    </section>
  );
}

export default ArticleListDynamic;
