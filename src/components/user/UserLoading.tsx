import React from 'react';

function UserLoading({ withBorder = true }: { withBorder: boolean }) {
  if (withBorder) {
    // 有 border 樣式
    return (
      <div className="w-[600px] my-4 border border-blue-300 shadow rounded-md p-4">
        <div className="animate-pulse flex space-x-4 items-center">
          <div className="rounded-full bg-slate-200 h-14 w-14" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2 w-20 bg-slate-200 rounded mt-1" />
            <div className="flex items-center mt-1">
              <div className="h-2 w-20 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="rounded-full bg-slate-200 h-8 w-16" />
        </div>
      </div>
    );
  }

  // 不含 border 樣式
  return (
    <div className="animate-pulse flex my-3 space-x-4 items-center bg-white dark:bg-gray-950">
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

export default UserLoading;
