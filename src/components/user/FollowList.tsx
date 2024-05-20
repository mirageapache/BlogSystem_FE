import React from 'react';
import { get, isEmpty } from 'lodash';

// --- types ---
import { FollowResultType } from 'types/followType';
import { UserDataType } from 'types/userType';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserLoading from './UserLoading';
import UserInfoPanel from './UserInfoPanel';

interface PropsType {
  type: string;
  followList: FollowResultType;
}

interface followerItemType {
  user: UserDataType;
  state: number;
}

function FollowList({ type, followList }: PropsType) {
  const { isLoading, data } = followList;
  let listData; // 清單資料
  const followingData: UserDataType[] = get(data, 'data.following', []);
  const followerData: followerItemType[] = get(data, 'data.follower', []);

  if (isLoading) return <UserLoading />;
  if (type === 'following' && isEmpty(followingData))
    return (
      <NoSearchResult msgOne="你還沒有追蹤其他人喔!" msgTwo="快去尋找有趣的人吧" type="user" />
    );
  if (type === 'follower' && isEmpty(followerData))
    return <NoSearchResult msgOne="你還沒有粉絲喔!" msgTwo="快去拓展你的粉絲圈吧" type="user" />;

  // 追蹤
  if (type === 'following') {
    listData = followingData!.map((item) => {
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
  }

  // 粉絲
  if (type === 'follower') {
    listData = followerData.map((item) => {
      return (
        <div className="flex justify-between" key={item.user._id}>
          <UserInfoPanel
            account={item.user.account}
            name={item.user.name}
            avatarUrl={item.user.avatar}
            bgColor={item.user.bgColor}
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
  }
  return <div>{listData}</div>;
}

export default FollowList;
