import React from 'react';
import { isEmpty } from 'lodash';
// --- components ---
import UserLoading from './UserLoading';
import UserListLoading from './UserListLoading';
import FollowingItem from './FollowingItem';
// --- types ---
import { UserDataType } from '../../types/userType';
import { getCookies } from '../../utils/common';
import UserInfoPanel from './UserInfoPanel';

interface PropType {
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
  refetch: () => void;
  type: string;
}

function UserListDynamic({ userListData, isLoading, atBottom, refetch, type }: PropType) {
  const currentUser = getCookies('uid');

  if (isLoading && isEmpty(userListData)) return <UserListLoading />;

  const userItems = userListData!.map((user) => {
    if (type === 'followed') {
      return (
        <UserInfoPanel
          key={user._id}
          userId={user._id}
          account={user.account}
          name={user.name}
          avatarUrl={user.avatar}
          bgColor={user.bgColor}
          className="my-2"
        />
      );
    }
    if (type === 'userList' && user._id === currentUser) return null;
    return <FollowingItem key={user._id} user={user} refetch={refetch} />;
  });

  return (
    <section className="w-full">
      <div>{userItems}</div>
      {atBottom ? (
        <div className="my-5 text-center text-gray-500">- 已經沒有更多資料了 -</div>
      ) : (
        <UserLoading withBorder={false} />
      )}
    </section>
  );
}

export default UserListDynamic;
