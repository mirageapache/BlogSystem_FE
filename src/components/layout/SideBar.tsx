import { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { isEmpty } from 'lodash';
import { checkLogin, getCookies } from 'utils/common';
import { Link } from 'react-router-dom';

/** SideBar Item 參數型別 */
type ItemProps = {
  href: string;
  text: string;
  count: number;
  children: ReactNode;
  activeItem: boolean;
  changeItem: () => void;
};

const activeStyle = 'text-orange-500 hover:text-orange-500 hover:fill-orange-500';
const normalStyle = 'text-gray-700 dark:text-gray-300 hover:text-orange-500';

/** SideBar Item 元件 */
function SideBarItem({ href, text, count, children, activeItem, changeItem }: ItemProps) {
  return (
    <Link
      to={href}
      className={`flex my-1.5 text-xl cursor-pointer py-4 ${
        activeItem ? activeStyle : normalStyle
      }`}
      onClick={changeItem}
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
    </Link>
  );
}

/** SideBar 元件 */
function SideBar() {
  const userId = getCookies('uid');
  const [activeItem, setActiveItem] = useState('home'); // 顯示作用中的 Item

  return (
    <div className="text-left h-fit sm:px-1 px-5">
      <div className="ml-2.5">
        <SideBarItem
          href="/"
          text="首頁"
          count={0}
          activeItem={activeItem === 'home'}
          changeItem={() => setActiveItem('home')}
        >
          <FontAwesomeIcon icon={icon({ name: 'home' })} />
        </SideBarItem>
        <SideBarItem
          href="/explore"
          text="探索"
          count={0}
          activeItem={activeItem === 'explore'}
          changeItem={() => setActiveItem('explore')}
        >
          <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem
          href="/search"
          text="搜尋"
          count={0}
          activeItem={activeItem === 'search'}
          changeItem={() => setActiveItem('search')}
        >
          <FontAwesomeIcon icon={icon({ name: 'search', style: 'solid' })} />
        </SideBarItem>
        {checkLogin() && (
          <>
            <SideBarItem
              href={`/profile/${userId}`}
              text="個人資料"
              count={0}
              activeItem={activeItem === 'profile'}
              changeItem={() => setActiveItem('profile')}
            >
              <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
            </SideBarItem>
            <SideBarItem
              href="/inbox"
              text="訊息匣"
              count={0}
              activeItem={activeItem === 'inbox'}
              changeItem={() => setActiveItem('inbox')}
            >
              <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
            </SideBarItem>
            <SideBarItem
              href="/activity"
              text="動態"
              count={0}
              activeItem={activeItem === 'activity'}
              changeItem={() => setActiveItem('activity')}
            >
              <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
            </SideBarItem>
          </>
        )}
      </div>
    </div>
  );
}
export default SideBar;
