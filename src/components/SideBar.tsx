import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

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
      className="flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-4"
    >
      <span className="flex items-center">{children}</span>
      <span className="ml-3 font-bold hidden lg:block">
        {text}
        {count > 0 && (
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
        <SideBarItem href="/" text="Home" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'home' })} />
        </SideBarItem>
        <SideBarItem href="/" text="Inbox" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
        </SideBarItem>
        <SideBarItem href="/" text="Chat" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'comment', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem href="/" text="Actiivity" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem href="/" text="Explore" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem href="/" text="Profile" count={0}>
          <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
        </SideBarItem>
      </div>
    </div>
  );
}
export default SideBar;
