import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { isEmpty } from 'lodash';

/** SideBar Item 參數型別 */
type ItemProps = {
  href: string;
  text: string;
  count: number;
  children: ReactNode;
};

/** SideBar Item 元件 */
function SideBarItem({ href, text, count, children }: ItemProps) {
  return (
    <a
      href={href}
      className="flex my-1.5 text-xl text-gray-700 dark:text-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-4"
    >
      <span className="flex items-center">{children}</span>
      <span className="ml-3 font-bold hidden lg:block">
        {text}
        {!isEmpty(count) && (
          <span className="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-orange-500 cursor-pointer">
            {count}
          </span>
        )}
      </span>
    </a>
  );
}

/** SideBar 元件 */
function SideBar() {
  return (
    <div className="text-left h-fit sm:px-1 px-5">
      <div className="ml-2.5">
        <SideBarItem href="/" text="首頁" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'home' })} />
        </SideBarItem>
        <SideBarItem href="/explore" text="探索" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem href="/search" text="搜尋" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'search', style: 'solid' })} />
        </SideBarItem>
        {/* 登入後顯示 */}
        <SideBarItem href="/profile" text="個人資料" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem href="/inbox" text="訊息匣" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
        </SideBarItem>
        <SideBarItem href="/activity" text="動態" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
        </SideBarItem>
      </div>
    </div>
  );
}
export default SideBar;
