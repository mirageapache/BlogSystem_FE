import React from 'react';
import { get, isEmpty } from 'lodash';

// --- types ---
import { FollowListType, FollowResultType } from 'types/followType';
import { UserDataType } from 'types/userType';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserLoading from './UserLoading';
import UserInfoPanel from './UserInfoPanel';

interface PropsType {
  type: string;
  followList: FollowResultType;
}

function FollowList({ type, followList }: PropsType) {
  const { isLoading, error, data } = followList;
  let followData: UserDataType[] = get(data, 'data.following', []);
  if (type === 'follower') followData = get(data, 'data.follower', []);

  const ListData = followData.map((item) => {
    return (
      <div className="flex justify-between" key={item._id}>
        <UserInfoPanel
          account={item.account}
          name={item.name}
          avatarUrl={item.avatar}
          bgColor={item.bgColor}
          className="my-2"
        />
        <div className="flex items-center">
          <button type="button" className="py-1 px-4 rounded-lg bg-green-600" onClick={() => {}}>
            追蹤
          </button>
        </div>
      </div>
    );
  });

  if (isLoading) return <UserLoading />;
  if (isEmpty(followData)) {
    if (type === 'following')
      return (
        <NoSearchResult msgOne="你還沒有追蹤其他人喔!" msgTwo="快去尋找有趣的人吧" type="user" />
      );
    if (type === 'follower')
      return <NoSearchResult msgOne="你還沒有粉絲喔!" msgTwo="快去拓展你的粉絲圈吧" type="user" />;
  }

  return <div>{ListData}</div>;
}

export default FollowList;
