import React from 'react';

function Loading() {
  return (
    <div className="w-[90vw] p-5 md:w-[600px] border border-red-500">
      <div className="w-full my-4 border border-blue-300 shadow rounded-md p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10" />
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 w-20 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-1" />
                <div className="h-2 bg-slate-200 rounded col-span-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2" />
                <div className="h-2 bg-slate-200 rounded col-span-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-1" />
                <div className="h-2 bg-slate-200 rounded col-span-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
