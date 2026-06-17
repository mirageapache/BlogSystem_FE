import React from 'react';

function Loading({ withBorder = true }: { withBorder: boolean }) {
  return (
    <div className="w-full" role="status" aria-label="loading animation">
      <div
        className={`w-full rounded-card p-4 ${
          withBorder ? 'my-4 border border-line bg-surface shadow-card' : ''
        }`}
      >
        <div className="animate-pulse">
          {/* user info */}
          <div className="flex mb-1 py-1 gap-4">
            <div className="rounded-full bg-line-strong/70 h-11 w-11" />
            <div>
              <div className="h-2.5 w-24 mt-2 bg-line-strong/70 rounded" />
              <div className="h-2 w-16 mt-2 bg-line-strong/50 rounded" />
            </div>
          </div>

          {/* article content */}
          <div className="flex-1 space-y-3 py-1">
            <div className="space-y-3">
              {/* 標題 */}
              <div className="grid grid-cols-3">
                <div className="h-7 bg-line-strong/70 rounded col-span-3" />
              </div>

              {/* 內文 */}
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div className="h-2 bg-line-strong/60 rounded col-span-1" />
                <div className="h-2 bg-line-strong/60 rounded col-span-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-line-strong/60 rounded col-span-2" />
                <div className="h-2 bg-line-strong/60 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-2 bg-line-strong/60 rounded col-span-1" />
                <div className="h-2 bg-line-strong/60 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-2 bg-line-strong/60 rounded col-span-1" />
                <div className="h-2 bg-line-strong/60 rounded col-span-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
