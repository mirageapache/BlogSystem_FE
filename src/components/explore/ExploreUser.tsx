import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useSearchParams } from 'react-router-dom';
// --- components ---
import UserListDynamic from 'components/user/UserListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / types ---
import { getSearchUserList } from 'api/user';
import { UserDataType } from 'types/userType';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ExploreUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || '';

  const { data, fetchNextPage, isLoading, refetch, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['exploreUser', searchString],
      queryFn: ({ pageParam }) => getSearchUserList(pageParam, searchString),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage?.nextPage > 0 ? lastPage.nextPage : undefined),
    });

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  const userList =
    isEmpty(data) || get(data, 'pages[0].code', undefined) === 'ERR_NETWORK'
      ? []
      : data!.pages.reduce((acc, page) => [...acc, ...page.userList], [] as UserDataType[]);

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

  if (!isLoading && userList.length === 0 && !isEmpty(data))
    return <NoSearchResult msgOne="搜尋不到相關用戶" msgTwo="" type="user" />;

  if (get(data, 'pages[0].code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-4xl p-1 sm:p-0">
      <UserListDynamic
        userListData={userList}
        isLoading={isLoading}
        atBottom={!hasNextPage}
        refetch={refetch}
        type="userList"
      />
    </div>
  );
}

export default ExploreUser;
