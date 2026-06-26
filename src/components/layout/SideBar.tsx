import { ReactNode, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPenNib, faPenToSquare, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faCompass, faUser } from '@fortawesome/free-regular-svg-icons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// --- functions ---
import { checkLogin, checkVisitor, guardVisitorAction, scrollToTop } from 'utils/common';
import { SysStateType, setActivePage, setEditMode } from '../../redux/sysSlice';
import { UserStateType } from '../../redux/userSlice';
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
  user: UserStateType;
}

const itemBase =
  'flex items-center gap-3 my-1 px-3 py-3 rounded-lg text-lg cursor-pointer transition-colors';
const activeStyle = 'bg-brand-soft text-brand';
const normalStyle = 'text-ink-soft hover:bg-surface-2 hover:text-ink';

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
          className={`w-full ${itemBase} ${normalStyle}`}
          onClick={() => {
            if (guardVisitorAction()) return;
            sliceDispatch(setShowCreateModal(true));
          }}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <span className="flex items-center w-6 justify-center">
            <FontAwesomeIcon icon={faPenToSquare} />
          </span>
          <span className="font-semibold hidden lg:block">建立貼文</span>
        </button>
      ) : (
        <Link
          to={href}
          className={`${itemBase} ${activeItem ? activeStyle : normalStyle}`}
          ref={tooltip}
          onClick={() => {
            changeItem();
            scrollToTop();
          }}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <span className="flex items-center w-6 justify-center">{children}</span>
          <span className="font-semibold hidden lg:block">
            {text}
            {!isEmpty(count) && (
              <span className="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-brand cursor-pointer">
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
  const userId = useSelector((state: StateType) => state.user.userData?.userId);

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
          <FontAwesomeIcon icon={faHome} />
        </SideBarItem>
        <SideBarItem
          href="/explore"
          text="探索"
          count={0}
          activeItem={activePage === 'explore'}
          changeItem={() => sliceDispatch(setActivePage('explore'))}
        >
          <FontAwesomeIcon icon={faCompass} />
        </SideBarItem>
        {checkLogin() && !checkVisitor() && (
          <>
            {/* <SideBarItem
              href="/inbox"
              text="訊息匣"
              count={0}
              activeItem={activePage === 'inbox'}
              changeItem={() => sliceDispatch(setActivePage('inbox'))}
            >
              <FontAwesomeIcon icon={faInbox} />
            </SideBarItem>
            <SideBarItem
              href="/activity"
              text="動態"
              count={0}
              activeItem={activePage === 'activity'}
              changeItem={() => sliceDispatch(setActivePage('activity'))}
            >
              <FontAwesomeIcon icon={faBell} />
            </SideBarItem> */}
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
              <FontAwesomeIcon icon={faUser} />
            </SideBarItem>
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
              <FontAwesomeIcon icon={faPenNib} />
            </SideBarItem>
            <SideBarItem
              href={checkLogin() ? '/my-articles' : ''}
              text="我的文章"
              count={0}
              activeItem={activePage === 'myArticles'}
              changeItem={() => sliceDispatch(setActivePage('myArticles'))}
            >
              <FontAwesomeIcon icon={faFileLines} />
            </SideBarItem>
            <SideBarItem href="" text="建立貼文" count={0} activeItem={false} changeItem={() => {}}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </SideBarItem>
          </>
        )}
      </div>
    </div>
  );
}
export default SideBar;
