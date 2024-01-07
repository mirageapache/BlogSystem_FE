import { useState } from 'react';
import brand from '../assets/images/brand.png';

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
      <div className="w-full sm:min-w-[640px] md:max-w-[768px] flex justify-between py-2 px-4">
        <div id="brand" className="">
          <a className="flex flex-row items-center w-fit" href="/">
            <img className="w-11 h-11 mr-2.5" src={brand} alt="logo" />
            <h3 className="text-3xl font-semibold">MyBlog</h3>
          </a>
        </div>
        <nav className="flex items-center text-lg">
          <ul className="hidden sm:flex flex-row items-center w-fit">
            <NavItem href="/" text="Blog" itemType="navItem" />
            <NavItem href="/tags" text="tags" itemType="navItem" />
            <NavItem href="/projects" text="projects" itemType="navItem" />
            <NavItem href="/About" text="About" itemType="navItem" />
          </ul>
          {/* Search btn */}
          <button aria-label="search" type="button" className="mx-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 m-1.5 text-gray-900 dark:text-gray-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
          {darkMode !== 'dark' ? (
            <>
              {/* DarkMode btn */}
              <button aria-label="darkMode" type="button" className="mx-2" onClick={handleDarkMode}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 m-1.5 text-gray-900 dark:text-gray-100"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 m-1.5 text-gray-900 dark:text-gray-100"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-7 w-7 m-1 text-gray-900 dark:text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-7 w-7 text-gray-900 dark:text-gray-100"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
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
