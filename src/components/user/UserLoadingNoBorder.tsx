import React from 'react';

function userLoadingNoBorder() {
  return (
    <div className="animate-pulse flex mb-3 space-x-4 items-center bg-white dark:bg-gray-950">
      <div className="rounded-full bg-slate-200 h-14 w-14" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-2 w-20 bg-slate-200 rounded mt-1" />
        <div className="flex items-center mt-1">
          <div className="h-2 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default userLoadingNoBorder;
