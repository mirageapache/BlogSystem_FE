import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
// --- components ---
import UserListDynamic from 'components/user/UserListDynamic';
import NoSearchResult from 'components/tips/NoSearchResult';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / types ---
import { UserDataType } from 'types/userType';
import { getFollowerList } from 'api/follow';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ProfileFollowed(props: { userId: string; identify: boolean }) {
  const { userId, identify } = props;

  const { data, fetchNextPage, isLoading, refetch, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['followed', userId],
      queryFn: ({ pageParam }) => getFollowerList(userId, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage && lastPage.nextPage > 0 ? lastPage.nextPage : undefined,
    });

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const followList =
    isEmpty(data) || get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce(
          (acc, page) => (page ? [...acc, ...page.followList] : acc),
          [] as UserDataType[]
        );

  /** 滾動判斷fetch新資料（交給 react-query 的 hasNextPage / isFetchingNextPage，避免 stale closure） */
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

  if (!isLoading && followList.length === 0 && !isEmpty(data)) {
    if (identify)
      return <NoSearchResult msgOne="你還沒有粉絲喔" msgTwo="快去拓展你的粉絲圈吧" type="user" />;
    return <NoSearchResult msgOne="沒有任何粉絲資訊" msgTwo=" " type="user" />;
  }

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-4xl p-1 sm:p-0">
      <UserListDynamic
        userListData={followList}
        isLoading={isLoading}
        atBottom={!hasNextPage}
        refetch={refetch}
        type="followed"
      />
    </div>
  );
}

export default ProfileFollowed;
