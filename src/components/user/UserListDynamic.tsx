import React from 'react';
import { isEmpty } from 'lodash';
// --- components ---
import PostItem from './PostItem';
// --- types ---
import { UserDataType } from '../../types/userType';
import UserLoading from './UserLoading';
import UserListLoading from './UserListLoading';

interface PropType {
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
}

function UserListDynamic({ userListData, isLoading, atBottom }: PropType) {
  if (isLoading && isEmpty(userListData)) return <UserListLoading />;

  const userItems = userListData!.map((user) => {
    return <PostItem key={user._id} userData={user} />;
  });

  return (
    <section className="w-full">
      <div>{userItems}</div>
      {atBottom ? (
        <div className="text-center">已經沒有更多貼文資料了</div>
      ) : (
        <UserLoading withBorder={false} />
      )}
    </section>
  );
}

export default UserListDynamic;
