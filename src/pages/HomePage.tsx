import { useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { useInfiniteQuery } from 'react-query';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import { PostDataType } from 'types/postType';
import { getPartialPosts } from 'api/post';
import { useDispatch } from 'react-redux';
import { setActivePage } from 'redux/sysSlice';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function HomePage() {
  const dispatch = useDispatch();

  /** 取得文章（無限滾動） */
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['homepagePost'],
    ({ pageParam = 1 }) => getPartialPosts(pageParam),
    {
      getNextPageParam: (lastPage) => (lastPage?.nextPage > 0 ? lastPage.nextPage : undefined),
    }
  );

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
    dispatch(setActivePage('home'));
  }, []);

  const postList =
    isEmpty(data) || get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce((acc, page) => [...acc, ...page.posts], [] as PostDataType[]);

  /** 監聽頁面滾動，到底就 fetchNextPage（由 react-query 自己管 page 狀態，避免 stale closure） */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (get(data, 'pages[0].code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={!hasNextPage} />
    </div>
  );
}

export default HomePage;
