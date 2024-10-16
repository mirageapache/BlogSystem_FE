import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / type ---
import { PostDataType } from 'types/postType';
import { getSearchPost } from 'api/post';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ProfilePost(props: { userId: string; identify: boolean }) {
  const { userId, identify } = props;
  let nextPage = -1; // 下一頁指標，如果為「-1」表示最後一頁了

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    ['profilePost'],
    ({ pageParam = 1 }) => getSearchPost('', userId, pageParam),
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

  const postList =
    isEmpty(data) ||
    get(data, 'pages[0].data.code', '') !== '' ||
    get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce((acc, page) => [...acc, ...page.posts], [] as PostDataType[]);

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

  if (get(data, 'pages[0].data.code', undefined) === 'NOT_FOUND') {
    if (identify)
      return (
        <NoSearchResult msgOne="你還沒發佈任何貼文" msgTwo="快發佈你的貼文動態" type="createPost" />
      );
    return <NoSearchResult msgOne="尚未發佈任何貼文" msgTwo=" " type="post" />;
  }

  if (get(data, 'pages[0].code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={nextPage < 0} />
    </div>
  );
}

export default ProfilePost;
