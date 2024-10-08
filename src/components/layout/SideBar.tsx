import { ReactNode, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { get, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// --- functions ---
import { checkLogin, getCookies, scrollToTop } from 'utils/common';
import { SysStateType, setActivePage, setEditMode } from '../../redux/sysSlice';
import { setShowCreateModal } from '../../redux/postSlice';
import { HINT_LABEL } from '../../constants/LayoutConstants';
import { setSignInPop } from '../../redux/loginSlice';

/** SideBar Item 參數型別 */
type ItemProps = {
  href: string;
  text: string;
  count: number;
  children: ReactNode;
  activeItem: boolean;
  changeItem: () => void;
};

interface StateType {
  system: SysStateType;
}

const activeStyle = 'text-orange-500 hover:text-orange-500 hover:fill-orange-500';
const normalStyle = 'text-gray-700 dark:text-gray-300 hover:text-orange-500';

/** SideBar Item 元件 */
function SideBarItem({ href, text, count, children, activeItem, changeItem }: ItemProps) {
  const [showTip, setShowTip] = useState(false);
  const sliceDispatch = useDispatch();
  const tooltip = useRef(null);

  return (
    <div className="relative">
      {text === '建立貼文' ? (
        <button
          type="button"
          ref={tooltip}
          className={`flex my-1.5 ml-3 text-xl cursor-pointer py-4 ${normalStyle}`}
          onClick={() => sliceDispatch(setShowCreateModal(true))}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={icon({ name: 'pen-to-square', style: 'solid' })} />
          </div>
          <span className="ml-3 font-bold hidden lg:block">建立貼文</span>
        </button>
      ) : (
        <Link
          to={href}
          className={`flex my-1.5 ml-3 text-xl cursor-pointer py-4 ${
            activeItem ? activeStyle : normalStyle
          }`}
          ref={tooltip}
          onClick={() => {
            changeItem();
            scrollToTop();
          }}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
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
      )}
      <div
        className={`absolute top-3 left-10 w-16 ${HINT_LABEL} ${showTip ? 'block' : 'hidden'} lg:hidden dark:font-bold z-50`}
      >
        {text}
      </div>
    </div>
  );
}

/** SideBar 元件 */
function SideBar() {
  const sliceDispatch = useDispatch();
  const systemState = useSelector((state: StateType) => state.system);
  const activePage = get(systemState, 'activePage');
  const userId = getCookies('uid');

  return (
    <div className="text-left h-fit sm:px-1">
      <div>
        <SideBarItem
          href="/"
          text="首頁"
          count={0}
          activeItem={activePage === '' || activePage === 'home'}
          changeItem={() => sliceDispatch(setActivePage('home'))}
        >
          <FontAwesomeIcon icon={icon({ name: 'home' })} />
        </SideBarItem>
        <SideBarItem
          href="/explore"
          text="探索"
          count={0}
          activeItem={activePage === 'explore'}
          changeItem={() => sliceDispatch(setActivePage('explore'))}
        >
          <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
        </SideBarItem>
        <SideBarItem
          href={checkLogin() ? `/user/profile/${userId}` : ''}
          text="個人資料"
          count={0}
          activeItem={activePage === 'user'}
          changeItem={() => {
            if (checkLogin()) {
              sliceDispatch(setActivePage('user'));
            } else {
              sliceDispatch(setSignInPop(true));
            }
          }}
        >
          <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
        </SideBarItem>
        {checkLogin() && (
          <>
            {/* <SideBarItem
              href="/inbox"
              text="訊息匣"
              count={0}
              activeItem={activePage === 'inbox'}
              changeItem={() => sliceDispatch(setActivePage('inbox'))}
            >
              <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
            </SideBarItem>
            <SideBarItem
              href="/activity"
              text="動態"
              count={0}
              activeItem={activePage === 'activity'}
              changeItem={() => sliceDispatch(setActivePage('activity'))}
            >
              <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
            </SideBarItem> */}
            <SideBarItem
              href="/article/create"
              text="撰寫文章"
              count={0}
              activeItem={activePage === 'write'}
              changeItem={() => {
                sliceDispatch(setActivePage('write'));
                sliceDispatch(setEditMode(true));
              }}
            >
              <FontAwesomeIcon icon={icon({ name: 'pen-nib', style: 'solid' })} />
            </SideBarItem>
            <SideBarItem href="" text="建立貼文" count={0} activeItem={false} changeItem={() => {}}>
              <FontAwesomeIcon icon={icon({ name: 'pen-to-square', style: 'solid' })} />
            </SideBarItem>
          </>
        )}
      </div>
    </div>
  );
}
export default SideBar;
