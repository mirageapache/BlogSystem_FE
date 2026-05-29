import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import ArticleListDynamic from 'components/article/ArticleListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / type ---
import { getSearchArticle } from 'api/article';
import { ArticleDataType } from 'types/articleType';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ProfileArticle(props: { userId: string; identify: boolean }) {
  const { userId, identify } = props;

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['profileArticle', userId],
    ({ pageParam = 1 }) => getSearchArticle('', userId, pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
      keepPreviousData: false,
    }
  );

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const articleList =
    isEmpty(data) || get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce(
          (acc, page) => (page ? [...acc, ...page.articles] : acc),
          [] as ArticleDataType[]
        );

  /** 滾動判斷fetch新資料 */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 350
      ) {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isLoading && articleList.length === 0 && !isEmpty(data)) {
    if (identify)
      return (
        <NoSearchResult
          msgOne="你還沒發佈任何文章"
          msgTwo="試試建立文章的功能"
          type="createArticle"
        />
      );
    return <NoSearchResult msgOne="尚未發佈任何文章" msgTwo=" " type="article" />;
  }

  if (get(data, 'pages[0].code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <ArticleListDynamic
        articleListData={articleList}
        isLoading={isLoading}
        atBottom={!hasNextPage}
      />
    </div>
  );
}

export default ProfileArticle;
