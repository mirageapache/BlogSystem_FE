import React from 'react';
// --- components ---
import SideBar from 'components/SideBar';
import Avatar from 'components/user/Avatar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';

function UserProfilePage() {
  return (
    <div className="max-w-[600px] p-5 border border-blue-500">
      <div className="flex gap-4 mb-3">
        <div>
          <Avatar avatarUrl="" size="w-[72px] h-[72px]" textSize="text-4xl" />
        </div>
        <div className="">
          <p className="text-3xl font-semibold">Ryan</p>
          <p className="text-gray-500">@ryan11</p>
        </div>
      </div>
      <div>
        <p>
          Helping software engineers level up and standout in their career.talks about how to level
          up in your software engineering career.
        </p>
      </div>
    </div>
  );
}

export default UserProfilePage;
