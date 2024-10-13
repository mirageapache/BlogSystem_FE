import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
import { useSearchParams } from 'react-router-dom';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / type ---
import { PostDataType } from 'types/postType';
import { getPartialPosts, getSearchPost } from 'api/post';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ExplorePost() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  let nextPage = -1; // 下一頁指標，如果為「-1」表示最後一頁了

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    ['explorePost', searchString],
    ({ pageParam = 1 }) =>
      isEmpty(searchString)
        ? getPartialPosts(pageParam)
        : getSearchPost(searchString, '', pageParam),
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

  const postList = data
    ? data.pages.reduce((acc, page) => [...acc, ...page.posts], [] as PostDataType[])
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
    return <NoSearchResult msgOne="搜尋不到相關貼文" msgTwo="" type="post" />;

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={nextPage < 0} />
    </div>
  );
}

export default ExplorePost;
