import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import NoSearchResult from 'components/tips/NoSearchResult';
import { getSearchArticle } from 'api/article';
import { ArticleDataType } from 'types/articleType';
import ArticleListDynamic from 'components/article/ArticleListDynamic';

function ProfileArticle(props: { userId: string }) {
  const { userId } = props;
  let nextPage = -1; // 下一頁指標，如果為「-1」表示最後一頁了

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    ['profileArticle'],
    ({ pageParam = 1 }) => getSearchArticle('', userId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        nextPage = lastPage.nextPage;
        return nextPage > 0 ? nextPage : undefined;
      },
      keepPreviousData: false,
    }
  );

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const articleList = data
    ? data.pages.reduce((acc, page) => [...acc, ...page.articles], [] as ArticleDataType[])
    : [];

  /** 滾動判斷fetch新資料 */
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 350
    ) {
      if (nextPage > 0) fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPage]);

  if (get(data, 'pages[0].code', undefined) === 'NOT_FOUND')
    return <NoSearchResult msgOne="搜尋不到相關文章" msgTwo="" type="article" />;

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <ArticleListDynamic
        articleListData={articleList}
        isLoading={isLoading}
        atBottom={nextPage < 0}
      />
    </div>
  );
}

export default ProfileArticle;
