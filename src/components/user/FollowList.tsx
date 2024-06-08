import React from 'react';
import { get, isEmpty } from 'lodash';

// --- types ---
import { FollowResultType } from 'types/followType';
import { UserDataType } from 'types/userType';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserLoading from './UserLoading';
import UserInfoPanel from './UserInfoPanel';
// --- functions ---
import { getCookies } from '../../utils/common';

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
  const userList: UserDataType[] = get(data, 'data', []);
  const followingData: UserDataType[] = get(data, 'data.following', []);
  const followerData: followerItemType[] = get(data, 'data.follower', []);
  const userId = getCookies('uid');

  if (isLoading) return <UserLoading />;
  if (type === 'following' && isEmpty(followingData))
    return (
      <NoSearchResult msgOne="你還沒有追蹤其他人喔!" msgTwo="快去尋找有趣的人吧" type="user" />
    );
  if (type === 'follower' && isEmpty(followerData))
    return <NoSearchResult msgOne="你還沒有粉絲喔!" msgTwo="快去拓展你的粉絲圈吧" type="user" />;

  const generateList = (dataList: UserDataType[]) => {
    return dataList.map((user) => {
      if (user._id === userId) return null;
      return (
        <div
          className="flex justify-between px-3 hover:bg-gray-100 dark:hover:bg-gray-900"
          key={user._id}
        >
          <UserInfoPanel
            userId={user._id}
            account={user.account}
            name={user.name}
            avatarUrl={user.avatar}
            bgColor={user.bgColor}
            className="my-2"
          />
          <div className="flex items-center">
            {user.isFollow ? (
              <button
                type="button"
                className="py-1 px-3 rounded-lg text-white bg-gray-500"
                onClick={() => {}}
              >
                追蹤中
              </button>
            ) : (
              <button
                type="button"
                className="py-1 px-3 rounded-lg text-white bg-green-600"
                onClick={() => {}}
              >
                追蹤
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  // 使用者清單
  if (type === 'userList') listData = generateList(userList);

  // 追蹤
  if (type === 'following') listData = generateList(followingData);

  // 粉絲
  if (type === 'follower') {
    listData = followerData.map((item) => {
      return (
        <div className="flex justify-between" key={item.user._id}>
          <UserInfoPanel
            userId={item.user._id}
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
