import React from 'react';

function UserLoading({ withBorder = true }: { withBorder: boolean }) {
  if (withBorder) {
    // 有 border 樣式
    return (
      <div className="w-[600px] my-4 border border-line bg-surface shadow-card rounded-card p-4">
        <div className="animate-pulse flex space-x-4 items-center">
          <div className="rounded-full bg-line-strong/70 h-14 w-14" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2.5 w-24 bg-line-strong/70 rounded mt-1" />
            <div className="flex items-center mt-1">
              <div className="h-2 w-16 bg-line-strong/50 rounded" />
            </div>
          </div>
          <div className="rounded-full bg-line-strong/70 h-8 w-16" />
        </div>
      </div>
    );
  }

  // 不含 border 樣式
  return (
    <div className="animate-pulse flex my-3 space-x-4 items-center">
      <div className="rounded-full bg-line-strong/70 h-14 w-14" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-2.5 w-24 bg-line-strong/70 rounded mt-1" />
        <div className="flex items-center mt-1">
          <div className="h-2 w-16 bg-line-strong/50 rounded" />
        </div>
      </div>
    </div>
  );
}

export default UserLoading;
