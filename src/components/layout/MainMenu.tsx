/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faInbox,
  faMoon,
  faPenNib,
  faPenToSquare,
  faRightFromBracket,
  faSun,
  faXmark,
  faFileLines,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faCompass } from '@fortawesome/free-regular-svg-icons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
// --- components ---
import UserInfoPanel from 'components/user/UserInfoPanel';
import UserLoading from 'components/user/UserLoading';
// --- functions / types ---
import { SysStateType, setActivePage, setDarkMode, setEditMode } from '../../redux/sysSlice';
import { UserStateType } from '../../redux/userSlice';
import { setShowCreateModal } from '../../redux/postSlice';
import { checkLogin, checkVisitor, guardVisitorAction, scrollToTop } from '../../utils/common';

/** Toggle Menu 參數型別 */
type ItemPropsType = {
  href: string;
  text: string;
  count: number;
  activeItem: boolean;
  children: ReactNode;
  handleClick: () => void;
};

interface MainMenuType {
  toggleMenuAnimation: string;
  setToggleMenuAnimation: (value: string) => void;
}

interface StateType {
  user: UserStateType;
  system: SysStateType;
}

/** MainMenu Item 元件 */
function MenuItem({ href, text, count, activeItem, children, handleClick }: ItemPropsType) {
  const sliceDispatch = useDispatch();

  const menuItemBase =
    'flex items-center gap-3 my-1 px-3 py-3 rounded-lg text-lg cursor-pointer transition-colors';
  const menuItemStyle = activeItem
    ? 'bg-brand-soft text-brand'
    : 'text-ink-soft hover:bg-surface-2 hover:text-brand';

  return (
    <li className="menu-item">
      {text === '建立貼文' ? (
        <button
          type="button"
          className={`w-full ${menuItemBase} ${menuItemStyle}`}
          onClick={() => {
            handleClick(); // 關閉選單
            if (guardVisitorAction()) return;
            sliceDispatch(setShowCreateModal(true));
          }}
        >
          <span className="flex items-center w-6 justify-center">
            <FontAwesomeIcon icon={faPenToSquare} />
          </span>
          <span className="font-semibold">{text}</span>
        </button>
      ) : (
        <Link to={href} className={`${menuItemBase} ${menuItemStyle}`} onClick={handleClick}>
          <span className="flex items-center w-6 justify-center">{children}</span>
          <span className="font-semibold">
            {text}
            {!isEmpty(count) && (
              <span className="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-brand cursor-pointer">
                {count}
              </span>
            )}
          </span>
        </Link>
      )}
    </li>
  );
}

/** MainMenu 元件 */
function MainMenu({ toggleMenuAnimation, setToggleMenuAnimation }: MainMenuType) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const systemState = useSelector((state: StateType) => state.system);
  const activePage = get(systemState, 'activePage');
  const swal = withReactContent(Swal);
  const userState = useSelector((state: StateType) => state.user);
  const { userData } = userState;

  /** 關閉選單(Menu) */
  const closeMenu = () => {
    setToggleMenuAnimation('translate-x-full');
  };

  /** 登出 */
  const handleLogout = () => {
    localStorage.removeItem('hasSession'); // 清除登入提示 flag
    swal
      .fire({
        title: '已成功登出',
        icon: 'info',
        confirmButtonText: '確認',
        timer: 2000,
        timerProgressBar: true,
      })
      .then(() => {
        closeMenu();
        dispatch(setActivePage('home'));
        navigate('/');
        window.location.reload();
      });
  };

  // 透過 Portal 掛載到 document.body，避免被 Header 的 backdrop-blur（backdrop-filter）
  // 變成 fixed 定位的容器塊，導致遮罩與面板被侷限在 Header 區域內。
  //
  // nav 本身為 position:fixed，會自成一個 stacking context；內部遮罩(z-40)/面板(z-50)
  // 只決定「容器內部」的堆疊順序，無法把整個選單抬升到 App 其他定位元素之上。
  // 因此在 nav 外層指定 z-[60]（高於全站最高的 z-50），讓整個選單疊在
  // SideBar(z-10)、Header(z-20)、編輯器工具列(z-40) 等之上。
  return createPortal(
    <nav id="main-menu" className="fixed z-[60]">
      {/* 遮罩：開啟時淡入並模糊背景 */}
      <button
        aria-label="closeMenuOverlay"
        type="button"
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          toggleMenuAnimation === 'translate-x-full'
            ? 'pointer-events-none opacity-0'
            : 'opacity-100'
        }`}
        onClick={closeMenu}
      />
      <div
        className={`fixed z-50 top-0 right-0 w-full sm:max-w-[320px] h-full flex flex-col transform duration-300 ease-in-out ${toggleMenuAnimation} bg-paper border-l border-line shadow-pop`}
      >
        <div className="z-10 w-full flex justify-end py-2 px-4">
          {/* 關閉選單 */}
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={closeMenu}
          >
            <FontAwesomeIcon icon={faXmark} className="h-7 w-7 m-1 text-ink" />
          </button>
        </div>
        {checkLogin() && (
          <div className="px-3 border-b border-line">
            {isEmpty(userData) ? (
              <UserLoading withBorder={false} />
            ) : (
              <Link
                to={`/user/profile/${userData!.userId}`}
                onClick={() => {
                  closeMenu();
                  dispatch(setActivePage('user'));
                  scrollToTop();
                }}
              >
                <UserInfoPanel
                  userId={userData.userId}
                  account={userData.account}
                  name={userData.name}
                  avatarUrl={userData.avatar}
                  bgColor={userData.bgColor}
                  className="my-2 py-2 px-3 rounded-lg hover:bg-surface-2 transition-colors"
                  menuLink
                />
              </Link>
            )}
          </div>
        )}
        <div className="h-full p-2 opacity-100">
          <div className="text-left h-fit sm:px-1">
            <ul className="ml-2.5">
              <MenuItem
                href="/"
                text="首頁"
                count={0}
                activeItem={activePage === '' || activePage === 'home'}
                handleClick={() => {
                  closeMenu();
                  dispatch(setActivePage('home'));
                  scrollToTop();
                }}
              >
                <FontAwesomeIcon icon={faHome} />
              </MenuItem>
              <MenuItem
                href="/explore"
                text="探索"
                count={0}
                activeItem={activePage === 'explore'}
                handleClick={() => {
                  closeMenu();
                  dispatch(setActivePage('explore'));
                  scrollToTop();
                }}
              >
                <FontAwesomeIcon icon={faCompass} />
              </MenuItem>
              {checkLogin() && !checkVisitor() && (
                <>
                  {/* <MenuItem
                    href="/inbox"
                    text="訊息匣"
                    count={0}
                    activeItem={activePage === 'inbox'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('inbox'));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={faInbox} />
                  </MenuItem> */}
                  {/* <MenuItem
                    href="/activity"
                    text="動態"
                    count={0}
                    activeItem={activePage === 'activity'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('activity'));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </MenuItem> */}
                  <MenuItem
                    href="/article/create"
                    text="撰寫文章"
                    count={0}
                    activeItem={activePage === 'write'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('write'));
                      dispatch(setEditMode(true));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={faPenNib} />
                  </MenuItem>
                  <MenuItem
                    href={checkLogin() ? '/my-articles' : ''}
                    text="我的文章"
                    count={0}
                    activeItem={activePage === 'myArticles'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('myArticles'));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={faFileLines} />
                  </MenuItem>
                  <MenuItem
                    href=""
                    text="建立貼文"
                    count={0}
                    activeItem={false}
                    handleClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </MenuItem>
                  <MenuItem
                    href={checkLogin() ? '/my-posts' : ''}
                    text="我的貼文"
                    count={0}
                    activeItem={activePage === 'myPosts'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('myPosts'));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={faNewspaper} />
                  </MenuItem>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 border-t border-line">
          {/* 深色模式切換 */}
          <button
            aria-label="darkMode"
            type="button"
            className="w-14 h-7 flex items-center border border-line-strong rounded-full px-2 bg-surface-2 transition-colors"
            onClick={() => {
              dispatch(setDarkMode());
            }}
          >
            <FontAwesomeIcon
              icon={faSun}
              className="h-5 w-5 text-brand translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
            />
            <FontAwesomeIcon
              icon={faMoon}
              className="absolute h-5 w-5 text-brand translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
            />
          </button>

          <button
            aria-label="logout"
            type="button"
            className="p-2 rounded-lg text-ink-soft hover:text-brand hover:bg-surface-2 transition-colors"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>,
    document.body
  );
}
export default MainMenu;
