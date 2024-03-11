import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- images ---
import brand from '../../assets/images/brand.png';
// --- components ---

import MainMenu from './MainMenu';

// --- functions / types ---
import { SearchStateType, setSearchText } from '../../redux/searchSlice';
import { LoginStateType, setSignInPop, setSignUpPop } from '../../redux/loginSlice';

/** Header 參數型別 */
// type HeaderPropsType = {
//   darkMode: string;
//   setDarkMode: Function;
// };

interface StateType {
  search: SearchStateType;
  login: LoginStateType;
}

function Header() {
  const [toggleMenuAnimation, setToggleMenuAnimation] = useState('translate-x-full'); // MainMenu 動畫效果
  const navigate = useNavigate();
  const searchState = useSelector((state: StateType) => state.search);
  const dispatch = useDispatch();
  const { searchText } = searchState;

  /** 跳轉至搜尋頁 */
  const handleSearch = (key: string) => {
    if (key === 'Enter' && searchText !== '') {
      navigate('/search');
    }
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
            <div className="hidden sm:flex items-center mr-1.5">
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
            {/* 登入 */}
            <button
              type="button"
              className="flex items-center rounded-full text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
              onClick={() => dispatch(setSignInPop(true))}
            >
              <p className="hidden md:inline-block">登入</p>
              <FontAwesomeIcon
                icon={icon({ name: 'user', style: 'regular' })}
                className="h-5 w-5 md:hidden dark:opacity-100"
              />
            </button>
            {/* 註冊 */}
            <button
              type="button"
              className="hidden md:flex items-center rounded-full ml-2 p-2 md:px-4 md:py-1 text-gray-400 border border-gray-400 dark:text-gray-300"
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
            className="flex justify-center items-center mx-1.5"
            onClick={() => setToggleMenuAnimation('translate-x-0')}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'bars', style: 'solid' })}
              className="h-6 w-6 m-1 text-gray-900 dark:text-gray-100"
            />
          </button>
        </nav>

        {/* 主選單 */}
        <MainMenu
          toggleMenuAnimation={toggleMenuAnimation}
          setToggleMenuAnimation={setToggleMenuAnimation}
        />
      </div>
    </header>
  );
}

export default Header;
