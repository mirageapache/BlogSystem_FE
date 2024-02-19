import React from 'react';
// --- components ---
import Avatar from './Avatar';
import FollowBtn from './FollowBtn';

function AuthorInfoPanel(props: { avatarUrl: string}) {
  const { avatarUrl } = props;
  return (
    <div className="flex my-4">
      <div className="flex justify-center items-center mr-4">
        <Avatar avatarUrl={avatarUrl} />
      </div>
      <div>
        <span className="flex">
          <p className="font-semibold">James</p>
          ｜
          <FollowBtn state={0} />
        </span>
        <span className="flex text-sm text-gary-400">
          <p>5min read</p>｜<p>January 15, 2023</p>
        </span>
      </div>
    </div>
  );
}

export default AuthorInfoPanel;
