import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
import { useSearchParams } from 'react-router-dom';
// --- components ---
import UserListDynamic from 'components/user/UserListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / types ---
import { getCookies } from 'utils/common';
import { getSearchUserList } from 'api/user';
import { UserDataType } from 'types/userType';
import { ERR_NETWORK_MSG } from 'constants/StringConstants';

function ExploreUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || '';
  const currentUser = getCookies('uid'); // 目前登入的使用者id (判斷追蹤狀態)
  let nextPage = -1;

  const { data, fetchNextPage, isLoading, refetch } = useInfiniteQuery(
    ['exploreUser', searchString],
    ({ pageParam = 1 }) => getSearchUserList(pageParam, searchString, currentUser),
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

  const userList = data
    ? data.pages.reduce((acc, page) => [...acc, ...page.userList], [] as UserDataType[])
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
    return <NoSearchResult msgOne="搜尋不到相關用戶" msgTwo="" type="user" />;

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <UserListDynamic
        userListData={userList}
        isLoading={isLoading}
        atBottom={nextPage < 0}
        refetch={refetch}
        type="userList"
      />
    </div>
  );
}

export default ExploreUser;
