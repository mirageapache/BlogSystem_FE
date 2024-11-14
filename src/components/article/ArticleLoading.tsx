import React from 'react';

function Loading({ withBorder = true }: { withBorder: boolean }) {
  return (
    <div className="w-[90vw] sm:w-[80vw] md:w-[560px]" role="status" aria-label="loading animation">
      <div
        className={`w-full ${withBorder ? 'my-4 border border-blue-300 shadow' : ''} rounded-md p-4`}
      >
        <div className="animate-pulse">
          {/* user info */}
          <div className="flex mb-1 py-1 gap-4">
            <div className="rounded-full bg-slate-300 h-10 w-10" />
            <div className="">
              <div className="h-2 w-20 mt-2 bg-slate-300 rounded" />
              <div className="h-2 w-20 mt-2 bg-slate-300 rounded" />
            </div>
          </div>

          {/* article content */}
          <div className="flex-1 space-y-3 py-1">
            <div className="space-y-3">
              {/* 標題 */}
              <div className="grid grid-cols-3">
                <div className="h-6 bg-slate-300 rounded col-span-3" />
              </div>

              {/* 內文 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-300 rounded col-span-1" />
                <div className="h-2 bg-slate-300 rounded col-span-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-300 rounded col-span-2" />
                <div className="h-2 bg-slate-300 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-2 bg-slate-300 rounded col-span-1" />
                <div className="h-2 bg-slate-300 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-2 bg-slate-300 rounded col-span-1" />
                <div className="h-2 bg-slate-300 rounded col-span-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
