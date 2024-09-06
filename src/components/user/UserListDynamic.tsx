import React from 'react';
import { isEmpty } from 'lodash';
// --- components ---
import UserLoading from './UserLoading';
import UserListLoading from './UserListLoading';
import FollowingItem from './FollowingItem';
// --- types ---
import { UserDataType } from '../../types/userType';
import { getCookies } from '../../utils/common';

interface PropType {
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
  refetch: () => void;
}

function UserListDynamic({ userListData, isLoading, atBottom, refetch }: PropType) {
  const currentUser = getCookies('uid');

  if (isLoading && isEmpty(userListData)) return <UserListLoading />;

  const userItems = userListData!.map((user) => {
    if (user._id === currentUser) return null;
    return <FollowingItem key={user._id} user={user} refetch={refetch} />;
  });

  return (
    <section className="w-full">
      <div>{userItems}</div>
      {atBottom ? (
        <div className="text-center">已經沒有更多資料了</div>
      ) : (
        <UserLoading withBorder={false} />
      )}
    </section>
  );
}

export default UserListDynamic;
