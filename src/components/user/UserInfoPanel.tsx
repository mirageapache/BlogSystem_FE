import React from 'react';
// --- components ---
import Avatar from './Avatar';

function UserInfoPanel(props: { account: string; name: string; avatarUrl: string; bgColor: string }) {
  const { account, name, avatarUrl, bgColor } = props;
  return (
    <div className="flex items-center my-4">
      <div className="flex justify-center items-center mr-4">
        <Avatar name={name} avatarUrl={avatarUrl} size="w-11 h-11" textSize="text-xl" bgColor={bgColor} />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-gray-700 dark:text-gray-400">@{account}</p>
      </div>
    </div>
  );
}

export default UserInfoPanel;
