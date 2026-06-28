import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['explorePost', searchString],
    queryFn: ({ pageParam }) =>
      isEmpty(searchString)
        ? getPartialPosts(pageParam)
        : getSearchPost(searchString, '', pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
  });

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const postList =
    isEmpty(data) || get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce(
          (acc, page) => (page ? [...acc, ...page.posts] : acc),
          [] as PostDataType[]
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

  if (!isLoading && postList.length === 0 && !isEmpty(data))
    return <NoSearchResult msgOne="搜尋不到相關貼文" msgTwo="" type="post" />;

  if (get(data, 'pages[0].code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[700px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={!hasNextPage} />
    </div>
  );
}

export default ExplorePost;
