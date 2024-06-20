/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { get, isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';
import withReactContent from 'sweetalert2-react-content';
import { Link } from 'react-router-dom';
// --- components ---
import UserInfoPanel from 'components/user/UserInfoPanel';
import UserLoadingNoBorder from 'components/user/UserLoadingNoBorder';
// --- functions / types ---
import { SysStateType, setActivePage, setDarkMode } from '../../redux/sysSlice';
import { UserStateType } from '../../redux/userSlice';
import { checkLogin, scrollToTop } from '../../utils/common';

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
  return (
    <li>
      <Link
        to={href}
        className={`flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-3  ${
          activeItem ? 'text-orange-500' : ''
        }`}
        onClick={handleClick}
      >
        <span className="flex items-center">{children}</span>
        <span className="ml-3 font-bold">
          {text}
          {!isEmpty(count) && (
            <span className="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-orange-500 cursor-pointer">
              {count}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

/** MainMenu 元件 */
function MainMenu({ toggleMenuAnimation, setToggleMenuAnimation }: MainMenuType) {
  const dispatch = useDispatch();
  const systemState = useSelector((state: StateType) => state.system);
  const activePage = get(systemState, 'activePage');
  const swal = withReactContent(Swal);
  const [cookies, setCookie, removeCookie] = useCookies(['uid']);
  const userState = useSelector((state: StateType) => state.user);
  const { userData } = userState;

  /** 關閉選單(Menu) */
  const closeMenu = () => {
    setToggleMenuAnimation('translate-x-full');
  };

  /** 登出 */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    removeCookie('uid');
    swal
      .fire({
        title: '已成功登出',
        icon: 'info',
        confirmButtonText: '確認',
      })
      .then(() => {
        closeMenu();
        // navigate('/');
      });
  };

  return (
    <nav className="fixed">
      <button
        type="button"
        className={`w-full h-full top-0 left-0 text-transparent ${
          toggleMenuAnimation === 'translate-x-full' ? 'none' : 'fixed'
        }`}
        onClick={closeMenu}
      />
      <div
        className={`fixed z-50 top-0 right-0 w-full sm:max-w-[300px] h-full flex flex-col transform duration-300 ease-in-out ${toggleMenuAnimation} bg-white opacity-[0.98] dark:bg-gray-950 dark:opacity-[0.98] border-l-[1px] border-gray-300 dark:border-gray-700`}
      >
        <div className="z-10 w-full flex justify-end py-2 px-4">
          {/* 關閉選單 */}
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={closeMenu}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="h-7 w-7 m-1 text-gray-900 dark:text-gray-100"
            />
          </button>
        </div>
        {checkLogin() && (
          <div className="px-3 border-b-[1px] border-gray-400 dark:border-gray-70">
            <Link
              to={`/user/profile/${userData.userId}`}
              onClick={() => {
                closeMenu();
                dispatch(setActivePage('user'));
                scrollToTop();
              }}
            >
              {isEmpty(userData) ? (
                <UserLoadingNoBorder />
              ) : (
                <UserInfoPanel
                  userId={userData._id}
                  account={userData.account}
                  name={userData.name}
                  avatarUrl={userData.avatar}
                  bgColor={userData.bgColor}
                  className="my-2 py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  menuLink
                />
              )}
            </Link>
          </div>
        )}
        <div className="h-full py-2 px-8 opacity-100">
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
                <FontAwesomeIcon icon={icon({ name: 'home' })} />
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
                <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
              </MenuItem>
              <MenuItem
                href="/search"
                text="搜尋"
                count={0}
                activeItem={activePage === 'search'}
                handleClick={() => {
                  closeMenu();
                  dispatch(setActivePage('search'));
                  scrollToTop();
                }}
              >
                <FontAwesomeIcon icon={icon({ name: 'search', style: 'solid' })} />
              </MenuItem>
              {checkLogin() && (
                <>
                  <MenuItem
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
                    <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
                  </MenuItem>
                  <MenuItem
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
                    <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
                  </MenuItem>
                  <MenuItem
                    href="/write"
                    text="撰寫文章"
                    count={0}
                    activeItem={activePage === 'write'}
                    handleClick={() => {
                      closeMenu();
                      dispatch(setActivePage('write'));
                      scrollToTop();
                    }}
                  >
                    <FontAwesomeIcon icon={icon({ name: 'pen-nib', style: 'solid' })} />
                  </MenuItem>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 border-t-[1px] border-gray-300 dark:border-gray-700">
          {/* 深色模式切換 */}
          <button
            aria-label="darkMode"
            type="button"
            className="w-14 h-7 flex items-center border border-gray-400 rounded-full px-2 bg-gray-150 dark:bg-gray-700"
            onClick={() => {
              dispatch(setDarkMode());
            }}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'sun', style: 'solid' })}
              className="h-5 w-5 text-gray-900 translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
            />
            <FontAwesomeIcon
              icon={icon({ name: 'moon', style: 'solid' })}
              className="absolute h-5 w-5 text-white translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
            />
          </button>

          <button aria-label="logout" type="button" className="p-2" onClick={handleLogout}>
            <FontAwesomeIcon
              icon={icon({ name: 'right-from-bracket', style: 'solid' })}
              className="h-5 w-5 text-gray-700 dark:text-gray-300"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
export default MainMenu;
