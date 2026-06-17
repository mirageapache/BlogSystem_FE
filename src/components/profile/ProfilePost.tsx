import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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

  // 使用 useInfiniteQuery 取得貼文
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['profilePost', userId],
    queryFn: ({ pageParam }) => getSearchPost('', userId, pageParam),
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

  if (!isLoading && postList.length === 0 && !isEmpty(data)) {
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
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={!hasNextPage} />
    </div>
  );
}

export default ProfilePost;
