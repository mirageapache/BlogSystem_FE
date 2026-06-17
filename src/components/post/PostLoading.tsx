import React from 'react';

function Loading({ withBorder = true }: { withBorder: boolean }) {
  return (
    <div className="w-full" role="status" aria-label="loading animation">
      <div
        className={`w-full rounded-card p-4 ${
          withBorder ? 'my-4 border border-line bg-surface shadow-card' : ''
        }`}
      >
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-line-strong/70 h-11 w-11" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2.5 w-24 bg-line-strong/70 rounded" />
            <div className="h-2 w-16 bg-line-strong/50 rounded" />
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-48 bg-line-strong/60 rounded-lg col-span-3" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-line-strong/70 rounded col-span-1" />
                <div className="h-2 bg-line-strong/70 rounded col-span-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-line-strong/70 rounded col-span-2" />
                <div className="h-2 bg-line-strong/70 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-2 bg-line-strong/70 rounded col-span-1" />
                <div className="h-2 bg-line-strong/70 rounded col-span-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
