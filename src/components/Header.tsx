import { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- functions / types ---
import { searchStateType, setSearchText } from '../redux/searchSlice';
// --- images ---
import brand from '../assets/images/brand.png';
// --- icons import ---
import { ReactComponent as DarkModeIcon } from '../assets/icons/darkMode.svg';
import { ReactComponent as LightModeIcon } from '../assets/icons/lightMode.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

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
interface stateType {
  search: searchStateType;
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
        {count > 0 && (
          <span className="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-orange-500 cursor-pointer">
            {count}
          </span>
        )}
      </span>
    </a>
  );
}

/** Headr 元件 */
function Header({ darkMode, setDarkMode }: HeaderPropsType) {
  const [toggleMenuAnimation, setToggleMenuAnimation] = useState('translate-x-full'); // Toggle Menu 動畫效果
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
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
                className="p-4 pl-10 w-40 h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out focus:w-80 outline-none"
              />
              <FontAwesomeIcon
                icon={icon({ name: 'search', style: 'solid' })}
                className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
              />
            </div>
          )}
          {/* 深色模式切換 */}
          <div className="flex justify-center items-center">
            <button
              aria-label="darkMode"
              type="button"
              className="flex w-9 h-9 mx-3 p-1.5 relative"
              onClick={handleDarkMode}
            >
              <DarkModeIcon className="h-6 w-6 rounded-full fill-gray-900 translate-y-0 opacity-100 transform duration-300 delay-200 ease-in-out dark:translate-y-4 dark:opacity-0" />
              <LightModeIcon className="absolute h-6 w-6 rounded-full fill-white translate-y-4 opacity-0 transform duration-300 delay-200 ease-in-out dark:translate-y-0 dark:opacity-100" />
            </button>
          </div>
          {/* 註冊/登入 */}
          <button
            type="button"
            className="hidden sm:inline-block rounded-full text-white bg-sky-500 hover:bg-sky-700 px-4 py-1 dark:bg-sky-800"
          >
            登入
          </button>
          {/* ToggleMenu btn */}
          <button
            aria-label="toggleMenu"
            type="button"
            className="mx-2 sm:hidden"
            onClick={() => setToggleMenuAnimation('translate-x-0')}
          >
            <MenuIcon className="h-7 w-7 m-1 fill-gray-900 dark:fill-gray-100" />
          </button>
        </nav>

        <div
          className={`fixed z-30 w-full h-full flex flex-col top-0 left-0 transform duration-300 ease-in-out ${toggleMenuAnimation} bg-white opacity-95 dark:bg-gray-950 dark:opacity-[0.98]`}
        >
          <div className="z-10 w-full flex justify-end p-4">
            {/* Close Menu btn */}
            <button
              aria-label="close"
              type="button"
              className="pr-3"
              onClick={() => setToggleMenuAnimation('translate-x-full')}
            >
              <CloseIcon className="h-7 w-7 fill-gray-900 dark:fill-gray-100" />
            </button>
          </div>
          <div className="h-full py-5 px-8 opacity-100">
            <MenuItem href="/" text="Home" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'home' })} />
            </MenuItem>
            <MenuItem href="/" text="Inbox" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
            </MenuItem>
            <MenuItem href="/" text="Chat" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'comment', style: 'regular' })} />
            </MenuItem>
            <MenuItem href="/" text="Actiivity" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
            </MenuItem>
            <MenuItem href="/" text="Explore" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
            </MenuItem>
            <MenuItem href="/" text="Profile" count={0}>
              <FontAwesomeIcon icon={icon({ name: 'user', style: 'regular' })} />
            </MenuItem>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
