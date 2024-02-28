import { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- images ---
import brand from '../assets/images/brand.png';
// --- components ---
import SignInPopup from './login/SignInPopup';
import SignUpPopup from './login/SignUpPopup';
// --- functions / types ---
import { SearchStateType, setSearchText } from '../redux/searchSlice';
import { LoginStateType, setSignInPop, setSignUpPop } from '../redux/loginSlice';

/** Toggle Menu 參數型別 */
type ItemPropsType = {
  href: string;
  text: string;
  count: number;
  children: ReactNode;
};

/** Header 參數型別 */
type HeaderPropsType = {
  darkMode: string;
  setDarkMode: Function;
};

/** stateType (Header) */
interface StateType {
  search: SearchStateType;
  login: LoginStateType;
}

/** Toggle Menu 元件 */
function MenuItem({ href, text, count, children }: ItemPropsType) {
  return (
    <a
      href={href}
      className="flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-4"
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
    </a>
  );
}

function Header({ darkMode, setDarkMode }: HeaderPropsType) {
  const [toggleMenuAnimation, setToggleMenuAnimation] = useState('translate-x-full'); // Toggle Menu 動畫效果
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchState = useSelector((state: StateType) => state.search);
  const loginState = useSelector((state: StateType) => state.login);
  const { searchText } = searchState;

  /** 跳轉至搜尋頁 */
  const handleSearch = (key: string) => {
    if (key === 'Enter' && searchText !== '') {
      navigate('/search');
    }
  };

  /** 深色模式切換 */
  const handleDarkMode = () => {
    setDarkMode(darkMode === 'dark' ? '' : 'dark');
  };

  /** 螢幕寬度大於768px收合toggle menu */
  function screenWidthChange() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 640 && toggleMenuAnimation === 'translate-x-0') {
      setToggleMenuAnimation('translate-x-full');
    }
  }
  /** 監聽螢幕寬度變化 */
  window.addEventListener('resize', screenWidthChange);

  return (
    <header className="fixed z-10 flex justify-center w-full bg-white dark:bg-gray-950 border-b-[1px] dark:border-gray-700">
      <div className="w-full flex justify-between py-2 px-4">
        <div id="brand" className="">
          <a className="flex flex-row items-center w-fit" href="/">
            <img className="w-11 h-11 mr-2.5" src={brand} alt="logo" />
            <h3 className="font-mono text-3xl font-semibold">MyBlog</h3>
          </a>
        </div>
        <nav className="flex items-center text-lg">
          {/* 搜尋 */}
          {window.location.pathname !== '/search' && (
            <div className="hidden sm:flex items-center">
              <input
                type="text"
                name="search"
                placeholder="搜尋..."
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                onKeyUp={(e) => handleSearch(e.key)}
                className="p-4 pl-10 w-40 h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out focus:w-76 outline-none"
              />
              <FontAwesomeIcon
                icon={icon({ name: 'search', style: 'solid' })}
                className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
              />
            </div>
          )}

          <div className="flex justify-around items-center">
            {/* 深色模式切換 */}
            <button
              aria-label="darkMode"
              type="button"
              className="hidden sm:flex justify-center items-center w-9 h-9 mx-1.5 md:mx-4 relative"
              onClick={handleDarkMode}
            >
              <FontAwesomeIcon
                icon={icon({ name: 'moon', style: 'solid' })}
                className="h-6 w-6 text-gray-900 translate-y-0 opacity-100 transform duration-300 delay-200 ease-in-out dark:translate-y-4 dark:opacity-0"
              />
              <FontAwesomeIcon
                icon={icon({ name: 'sun', style: 'solid' })}
                className="absolute h-6 w-6 rounded-full text-white translate-y-4 opacity-0 transform duration-300 delay-200 ease-in-out dark:translate-y-0 dark:opacity-100"
              />
            </button>
            {/* 登入 */}
            <button
              type="button"
              className="flex items-center rounded-full text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
              onClick={() => dispatch(setSignInPop(true))}
            >
              <p className="hidden md:inline-block">登入</p>
              <FontAwesomeIcon
                icon={icon({ name: 'right-to-bracket', style: 'solid' })}
                className="h-5 w-5 md:hidden dark:opacity-100"
              />
            </button>
            {/* 註冊 */}
            <button
              type="button"
              className="hidden md:flex items-center rounded-full ml-2 p-2 md:px-4 md:py-1 text-gray-500 border border-gray-400 dark:border-gray-700"
              onClick={() => dispatch(setSignUpPop(true))}
            >
              <p className="hidden md:inline-block">註冊</p>
              <FontAwesomeIcon
                icon={icon({ name: 'user-plus', style: 'solid' })}
                className="h-5 w-5 md:hidden dark:opacity-100"
              />
            </button>
          </div>

          {/* 選單按鈕 */}
          <button
            aria-label="toggleMenu"
            type="button"
            className="flex justify-center items-center mx-1.5 sm:hidden "
            onClick={() => setToggleMenuAnimation('translate-x-0')}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'bars', style: 'solid' })}
              className="h-6 w-6 m-1 text-gray-900 dark:text-gray-100"
            />
          </button>
        </nav>

        {/* 手機版選單 */}
        <div
          className={`fixed z-30 w-full h-full flex flex-col top-0 left-0 transform duration-300 ease-in-out ${toggleMenuAnimation} bg-white opacity-95 dark:bg-gray-950 dark:opacity-[0.98]`}
        >
          <div className="z-10 w-full flex justify-end py-2 px-4">
            {/* 關閉選單 */}
            <button
              aria-label="close"
              type="button"
              className="flex jsutify-center m-1"
              onClick={() => setToggleMenuAnimation('translate-x-full')}
            >
              <FontAwesomeIcon
                icon={icon({ name: 'xmark', style: 'solid' })}
                className="h-7 w-7 m-1 text-gray-900 dark:text-gray-100"
              />
            </button>
          </div>
          <div className="h-full py-5 px-8 opacity-100">
            <div className="flex border border-red-500">
              {/* 模式切換 */}
              {/* <button
                aria-label="darkMode"
                type="button"
                className="hidden sm:flex justify-center items-center w-9 h-9 mx-1.5 md:mx-4 relative"
                onClick={handleDarkMode}
              >
                <FontAwesomeIcon
                  icon={icon({ name: 'moon', style: 'solid' })}
                  className="h-6 w-6 text-gray-900 translate-y-0 opacity-100 transform duration-300 delay-200 ease-in-out dark:translate-y-4 dark:opacity-0"
                />
                <FontAwesomeIcon
                  icon={icon({ name: 'sun', style: 'solid' })}
                  className="absolute h-6 w-6 rounded-full text-white translate-y-4 opacity-0 transform duration-300 delay-200 ease-in-out dark:translate-y-0 dark:opacity-100"
                />
              </button> */}
            </div>
            <MenuItem href="/" text="首頁" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'home' })} />
            </MenuItem>
            <MenuItem href="/explore" text="探索" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
            </MenuItem>
            <MenuItem href="/search" text="搜尋" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'search', style: 'solid' })} />
            </MenuItem>
            {/* 登入後顯示 */}
            <MenuItem href="/profile" text="個人資料" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
            </MenuItem>
            <MenuItem href="/inbox" text="訊息匣" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
            </MenuItem>
            <MenuItem href="/activity" text="動態" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
            </MenuItem>
          </div>
        </div>
      </div>

      {/* 登入&註冊 Modal */}
      {loginState.showSignInPop && <SignInPopup />}
      {loginState.showSignUpPop && <SignUpPopup />}
    </header>
  );
}

export default Header;
