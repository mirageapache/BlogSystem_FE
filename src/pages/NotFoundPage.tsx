import React from 'react';
import { Link } from 'react-router-dom';
import { BTN_PRIMARY } from 'constants/LayoutConstants';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-6 text-center">
      <p className="font-serif text-7xl sm:text-9xl font-bold text-brand leading-none">404</p>
      <h2 className="mt-6 text-ink">你查詢的頁面不存在</h2>
      <p className="mt-3 text-muted">頁面可能已被移除，或網址輸入有誤。</p>
      <Link to="/" className={`${BTN_PRIMARY} mt-8 px-6 py-2.5 rounded-full`}>
        返回首頁
      </Link>
    </div>
  );
}

export default NotFoundPage;
