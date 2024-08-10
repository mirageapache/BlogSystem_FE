import React from 'react';
import UserLoading from './UserLoading';

function UserListLoading() {
  const arr = [1, 2, 3, 4, 5, 6];
  const loadingList = arr.map((item) => {
    return (
      <div key={`loading-${item}`} className="border-b-[1px] dark:border-gray-700 last:border-b-0">
        <UserLoading withBorder={false} />
      </div>
    );
  });

  return <div className="w-full mx-2 sm:m-0">{loadingList}</div>;
}

export default UserListLoading;
