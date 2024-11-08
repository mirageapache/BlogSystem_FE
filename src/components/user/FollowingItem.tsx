/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { isEmpty } from 'lodash';
// --- api/type ---
import { UserDataType } from 'types/userType';
import { getCookies } from '../../utils/common';
// --- components ---
import UserInfoPanel from './UserInfoPanel';
import FollowBtn from './FollowBtn';

interface PropType {
  user: UserDataType;
  refetch: () => void;
}

function FollowingItem({ user, refetch }: PropType) {
  const currentUser = getCookies('uid');

  return (
    <div
      className="flex justify-between px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
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
      {!isEmpty(currentUser) && user._id !== currentUser && (
        <div className="relative flex items-center">
          <FollowBtn user={user} currentUser={currentUser!} refetch={refetch} />
        </div>
      )}
    </div>
  );
}

export default FollowingItem;
