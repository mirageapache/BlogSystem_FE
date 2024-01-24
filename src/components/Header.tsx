import { useState } from 'react';
import brand from '../assets/images/brand.png';

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
  const [darkModeAnimation, setDarkModeAnimation] = useState('translate-y-0 opacity-100'); // 深色模式按鈕動畫效果
  const [lightModeAnimation, setLightModeAnimation] = useState('translate-y-3 opacity-0'); // 明亮模式按鈕動畫效果
  const [searchInputAnimation, setSearchInputAnimation] = useState('w-0 bg-white'); // 搜尋輸入框動畫效果

  // 控制深色模式
  function handleDarkMode() {
    setDarkMode(darkMode === 'dark' ? '' : 'dark');
    setDarkModeAnimation(darkMode === 'dark' ? 'translate-y-0 opacity-100 delay-300 ease-in' : 'translate-y-3 opacity-0 ease-in');
    setLightModeAnimation(darkMode === 'dark' ? 'translate-y-3 opacity-0 ease-in' : 'translate-y-0 opacity-100 delay-300 ease-in');
  }

  // 控制搜尋輸入框
  function SearchInputFocus(){
    setSearchInputAnimation('')
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
          <div className='flex items-center relative border border-red-500'>
            <input type="text" placeholder="搜尋..." className={`p-4 h-6 text-lg rounded-full ${searchInputAnimation}`} />
            <button aria-label="search" type="button" className="absolute right-0">
              <SearchIcon className="h-5 w-5 m-1.5 border stroke-0 fill-gray-900 dark:fill-gray-100" />
            </button>
          </div>
          {/* 深色模式切換 */}
          <div className="flex justify-center items-center relative">
            <button aria-label="darkMode" type="button" className="mx-2" onClick={handleDarkMode}>
              <DarkModeIcon className={`h-9 w-9 rounded-full p-2 m-1.5 fill-gray-900 dark:fill-gray-100 hover:bg-gray-300 transform duration-300 ${darkModeAnimation}`} />
            </button>
            <button aria-label="lightMode" type="button" className="mx-2 absolute" onClick={handleDarkMode}>
              <LightModeIcon className={`h-9 w-9 rounded-full p-2 m-1.5 fill-gray-900 dark:fill-gray-100 hover:bg-gray-600 transform duration-300 ${lightModeAnimation}`} />
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
