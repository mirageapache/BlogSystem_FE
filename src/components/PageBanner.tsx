import React from 'react';

/** PageBanner 參數型別 */
interface PageBannerType {
  title: string;
  children: React.ReactNode;
}

/** PageBanner 元件 */
function PageBanner(props: PageBannerType) {
  const { title, children } = props;

  return (
    <div className="w-full">
      <h1 className=" text-4xl">{title}</h1>
      <div>{children}</div>
    </div>
  );
}

export default PageBanner;
