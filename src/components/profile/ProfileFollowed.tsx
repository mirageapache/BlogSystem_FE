import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
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
  let nextPage = -1;

  const { data, fetchNextPage, isLoading, refetch } = useInfiniteQuery(
    ['followed', userId],
    ({ pageParam = 1 }) => getFollowerList(userId, pageParam),
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

  const followList = data
    ? data.pages.reduce((acc, page) => [...acc, ...page.followList], [] as UserDataType[])
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

  if (get(data, 'pages[0].data.code', undefined) === 'NOT_FOUND') {
    if (identify)
      return <NoSearchResult msgOne="你還沒有粉絲喔" msgTwo="快去拓展你的粉絲圈吧" type="user" />;
    return <NoSearchResult msgOne="沒有任何粉絲資訊" msgTwo=" " type="user" />;
  }

  if (!isEmpty(data) && get(data, 'code', undefined) === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <UserListDynamic
        userListData={followList}
        isLoading={isLoading}
        atBottom={nextPage < 0}
        refetch={refetch}
        type="followed"
      />
    </div>
  );
}

export default ProfileFollowed;
