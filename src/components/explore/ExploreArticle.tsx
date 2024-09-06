import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
import { useSearchParams } from 'react-router-dom';
// --- components ---
import ArticleListDynamic from 'components/article/ArticleListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / type ---
import { getPartialArticles, getSearchArticle } from 'api/article';
import { ArticleDataType } from 'types/articleType';

function ExploreArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  let nextPage = -1; // 下一頁指標，如果為「-1」表示最後一頁了

  // 使用 useInfiniteQuery 取得文章
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    ['exploreArticle', searchString],
    ({ pageParam = 1 }) =>
      isEmpty(searchString)
        ? getPartialArticles(pageParam)
        : getSearchArticle(searchString, '', pageParam),
    {
      getNextPageParam: (lastPage) => {
        nextPage = lastPage.nextPage;
        return nextPage > 0 ? nextPage : undefined;
      },
      // 當 searchString 改變時，重置頁面
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

export default ExploreArticle;
