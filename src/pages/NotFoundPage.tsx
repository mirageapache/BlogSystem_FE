import React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center mt-10">
      <p className="m-5 text-6xl sm:text-8xl">404</p>
      <p className="m-5 text-3xl sm:text-5xl">你查詢的頁面不存在！</p>
    </div>
  );
}

export default NotFoundPage;
