import { useState } from 'react';
import brand from '../assets/images/brand.png';
// --- icons import ---
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as DarkModeIcon } from '../assets/icons/darkMode.svg';
import { ReactComponent as LightModeIcon } from '../assets/icons/lightMode.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

type NavProps = {
  href: string;
  text: string;
  itemType: string;
};

function NavItem({ href, text, itemType }: NavProps) {
  return (
    <li className={`mx-2.5 ${itemType === 'menuItem' && 'p-3'}`}>
      <a href={href}>{text}</a>
    </li>
  );
}

type HeaderProps = {
  darkMode: string;
  setDarkMode: Function;
};

function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [toggleMenuAnimation, setToggleMenuAnimation] = useState('translate-x-full'); // Toggle Menu 動畫效果

  /** 深色模式切換 */
  const handleDarkMode = () => {
    setDarkMode(darkMode === 'dark' ? '' : 'dark');
  }

  return (
    <header className="flex justify-center w-full">
      <div className="w-full sm:min-w-[640px] xl:max-w-6xl flex justify-between py-2 px-4">
        <div id="brand" className="">
          <a className="flex flex-row items-center w-fit" href="/">
            <img className="w-11 h-11 mr-2.5" src={brand} alt="logo" />
            <h3 className="font-mono text-3xl font-semibold">MyBlog</h3>
          </a>
        </div>
        <nav className="flex items-center text-lg">
          {/* 搜尋 */}
          <div className='hidden sm:flex items-center'>
            <input 
              type="text"
              placeholder="搜尋..." 
              className="p-4 pl-10 w-40 h-9 text-lg rounded-full bg-gray-300 dark:bg-gray-700 transition-all duration-300 ease-in-out focus:w-80 outline-none" 
            />
            <SearchIcon className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 fill-gray-500 dark:fill-gray-100" />
          </div>
          {/* 深色模式切換 */}
          <div className="flex justify-center items-center">
            <button aria-label="darkMode" type="button" className="flex w-9 h-9 mx-3 p-1.5 relative" onClick={handleDarkMode}>
              <DarkModeIcon className="h-6 w-6 rounded-full fill-gray-900 translate-y-0 opacity-100 transform duration-300 delay-200 ease-in-out dark:fill-gray-100 dark:translate-y-4 dark:opacity-0" />
              <LightModeIcon className="absolute h-6 w-6 rounded-full fill-gray-900 translate-y-4 opacity-0 transform duration-300 delay-200 ease-in-out dark:fill-gray-100 dark:translate-y-0 dark:opacity-100" />
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
          className={`fixed w-full h-full flex flex-col top-0 left-0 transform duration-300 ease-in-out ${toggleMenuAnimation} bg-white opacity-95 dark:bg-gray-950 dark:opacity-[0.98]`}
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
          <div className="z-10 h-full py-5">
            <ul className="text-2xl text-left mx-8">
              <NavItem href="/" text="Blog" itemType="menuItem" />
              <NavItem href="/tags" text="tags" itemType="menuItem" />
              <NavItem href="/projects" text="projects" itemType="menuItem" />
              <NavItem href="/About" text="About" itemType="menuItem" />
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
