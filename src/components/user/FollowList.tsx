import React from 'react';
import { get } from 'lodash';

// --- types ---
import { FollowResultType } from 'types/followType';
// --- components ---
import Avatar from './Avatar';
import UserLoading from './UserLoading';

interface PropsType {
  type: string;
  followList: FollowResultType;
}

function FollowList({ type, followList }: PropsType) {
  const { isLoading, error, data } = followList;
  const followData =
    type === 'follower' ? get(data, 'data.follower', {}) : get(data, 'data.following', {});

  console.log(followData);

  // const ListData = followData.map((item, index) => {
  //   console.log(item);
  //   return (
  //     <div className="flex" key={item.userId}>
  //       <Avatar name="avatar" avatarUrl="" size="w-11 h-11" textSize="text-xl" bgColor="" />
  //       {/* <div></div> */}
  //     </div>
  //   );
  // });

  if (isLoading) return <UserLoading />;

  return (
    <div>
      {/* <div className="flex">
        <Avatar name="avatar" avatarUrl="" size="w-11 h-11" textSize="text-xl" bgColor="" />
        <div></div>
      </div> */}
    </div>
  );
}

export default FollowList;
