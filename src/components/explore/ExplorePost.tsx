import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import { PostDataType, PostResultType } from 'types/postType';
import { getPartialPosts, getSearchPost } from 'api/post';
import { useSearchParams } from 'react-router-dom';

function ExplorePost() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  // const [page, setPage] = useState(1); // (動態載入)目前呈現的post資料取得的index(頁碼)
  // const [postList, setPostList] = useState<PostDataType[]>([]); // 儲存post資料
  // const [preSearch, setPreSearch] = useState(''); // 紀錄前一個搜尋字串，用來判斷searchString是否變動
  // const fetchPage = searchString !== preSearch ? 1 : page; // 判斷搜尋字串不同

  // useEffect(() => {
  //   setPostList([]);
  //   setPage(1);
  // }, [searchString]);

  // 使用 useInfiniteQuery
  const { data, error, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      ['explorePost', searchString],
      ({ pageParam = 1 }) =>
        isEmpty(searchString)
          ? getPartialPosts(pageParam)
          : getSearchPost(searchString, '', pageParam),
      {
        getNextPageParam: (lastPage) => {
          const next = lastPage.nextPage;
          return next > 0 ? next : undefined;
        },
        // 當 searchString 改變時，重置所有頁面
        keepPreviousData: false,
      }
    );

  /** 取得文章 */
  // const postListData = useQuery(['explorePost', searchString], () =>
  //   isEmpty(searchString) ? getPartialPosts(page) : getSearchPost(searchString, '', page)
  // ) as PostResultType;
  // const { isLoading, data, refetch } = postListData;

  // const posts = get(data, 'posts', []) as PostDataType[]; // 貼文資料
  const nextPage = get(data, 'pages.post.nextPage', 1); // 下一頁指標，如果為「-1」表示最後一頁了
  const hasmore = get(data, 'ppages.post.hasmore', false);

  console.log(hasmore);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const postList = data
    ? data.pages.reduce((acc, page) => [...acc, ...page.posts], [] as PostDataType[])
    : [];

  // useEffect(() => {
  //   if (!isEmpty(posts)) {
  //     setPostList((prevData) => [...prevData, ...posts]);
  //     setPage(nextPage);
  //   }
  // }, [posts, nextPage]);

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
  }, []);

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={nextPage < 0} />
    </div>
  );
}

export default ExplorePost;
