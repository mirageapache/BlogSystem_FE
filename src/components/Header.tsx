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
  const [toggleMenu, setToggleMenu] = useState('translate-x-full');

  // Dark Mode
  function handleDarkMode() {
    setDarkMode(darkMode === 'dark' ? '' : 'dark');
  }

  return (
    <header className="flex justify-center w-full">
      <div className="w-full sm:min-w-[640px] md:max-w-[768px] xl:max-w-6xl flex justify-between py-2 px-10 md:px-4">
        <div id="brand" className="">
          <a className="flex flex-row items-center w-fit" href="/">
            <img className="w-11 h-11 mr-2.5" src={brand} alt="logo" />
            <h3 className="font-mono text-3xl font-semibold">MyBlog</h3>
          </a>
        </div>
        <nav className="flex items-center text-lg">
          <ul className="hidden sm:flex flex-row items-center w-fit">
            <NavItem href="/" text="Blog" itemType="navItem" />
            <NavItem href="/topical" text="Topical" itemType="navItem" />
            <NavItem href="/projects" text="Projects" itemType="navItem" />
            <NavItem href="/About" text="About" itemType="navItem" />
          </ul>
          {/* Search btn */}
          <button aria-label="search" type="button" className="mx-2">
            <SearchIcon className="h-5 w-5 m-1.5 stroke-0 fill-gray-900 dark:fill-gray-100" />
          </button>
          {darkMode !== 'dark' ? (
            <>
              {/* DarkMode btn */}
              <button aria-label="darkMode" type="button" className="mx-2" onClick={handleDarkMode}>
                <DarkModeIcon className="h-6 w-6 m-1.5 fill-gray-900 dark:fill-gray-100" />
              </button>
            </>
          ) : (
            <>
              {/* LightMode btn */}
              <button
                aria-label="lightMode"
                type="button"
                className="mx-2"
                onClick={handleDarkMode}
              >
                <LightModeIcon className="h-6 w-6 m-1.5 fill-gray-900 dark:fill-gray-100" />
              </button>
            </>
          )}
          {/* ToggleMenu btn */}
          <button
            aria-label="toggleMenu"
            type="button"
            className="mx-2 sm:hidden"
            onClick={() => setToggleMenu('translate-x-0')}
          >
            <MenuIcon className="h-7 w-7 m-1 fill-gray-900 dark:fill-gray-100" />
          </button>
        </nav>

        <div
          className={`fixed w-full h-full flex flex-col top-0 left-0 transform duration-300 ease-in-out ${toggleMenu} bg-white opacity-95 dark:bg-gray-950 dark:opacity-[0.98]`}
        >
          <div className="z-10 w-full flex justify-end p-4">
            {/* Close Menu btn */}
            <button
              aria-label="close"
              type="button"
              className="pr-3"
              onClick={() => setToggleMenu('translate-x-full')}
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
