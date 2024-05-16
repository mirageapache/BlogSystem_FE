import React from 'react';
import Avatar from './Avatar';

interface PropsType {
  followList: any;
}

function FollowList({ followList }: PropsType) {
  console.log(followList);

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
