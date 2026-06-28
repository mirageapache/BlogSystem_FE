/* eslint-disable no-restricted-globals */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { faBars, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
// --- images ---
import brand from '../../assets/images/brand_img.png';
// --- components ---
import MainMenu from './MainMenu';
import BackwardBtn from '../../components/common/BackwardBtn';
// --- functions / types ---
import { setSignInPop, setSignUpPop } from '../../redux/loginSlice';
import { checkLogin } from '../../utils/common';
import { setActivePage } from '../../redux/sysSlice';

function Header() {
  const [toggleMenuAnimation, setToggleMenuAnimation] = useState('translate-x-full'); // MainMenu 動畫效果
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState<string>();
  const dispatch = useDispatch();
  let showBackward = false;
  const path = window.location.pathname;
  if (path.includes('/article/') || path.includes('/post/') || path.includes('/user/'))
    showBackward = true;

  /** 跳轉至搜尋頁 */
  const handleSearch = (key: string) => {
    if (key === 'Enter' && searchString !== '') {
      dispatch(setActivePage('explore'));
      navigate(`/explore?search=${searchString}`);
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
    <header className="fixed z-20 flex justify-center w-full bg-paper/80 backdrop-blur-md border-b border-line">
      <div className="w-full flex justify-between py-2 px-4">
        <div className="block sm:hidden">
          <span className="flex justify-center items-center w-9 h-9">
            {showBackward && <BackwardBtn />}
          </span>
        </div>
        <div id="brand" className="flex justify-center">
          <Link
            className="flex flex-row items-center w-fit"
            to="/"
            onClick={() => dispatch(setActivePage('home'))}
          >
            <img className="w-8 h-8 sm:w-11 sm:h-11 mr-1 sm:mr-2.5" src={brand} alt="logo" />
            <h3 className="font-brand text-[20px] sm:text-3xl tracking-tight">ReactBlog</h3>
          </Link>
        </div>
        <nav className="flex items-center text-lg">
          {/* 搜尋 */}
          {!path.includes('/explore') && (
            <div className="hidden sm:flex items-center mr-1.5">
              <input
                type="text"
                name="search"
                placeholder="搜尋..."
                onChange={(e) => setSearchString(e.target.value)}
                onKeyUp={(e) => handleSearch(e.key)}
                className="p-4 pl-10 w-40 h-9 text-base rounded-full bg-surface-2 border border-line transition-all duration-300 ease-in-out focus:w-80 focus:rounded-full focus:border-brand outline-none focus-visible:outline-none placeholder:text-muted"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute h-4 w-4 m-2 ml-3.5 stroke-0 text-muted"
              />
            </div>
          )}

          {checkLogin() ? (
            <>
              {/* 選單按鈕 */}
              <button
                aria-label="toggleMenu"
                type="button"
                className="flex justify-center items-center mx-1 p-1.5 rounded-lg text-ink hover:bg-surface-2 transition-colors"
                onClick={() => setToggleMenuAnimation('translate-x-0')}
              >
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              </button>
            </>
          ) : (
            <div className="flex justify-around items-center">
              {/* 登入 */}
              <button
                type="button"
                className="flex items-center rounded-full text-white bg-brand hover:bg-brand-strong p-2 md:px-4 md:py-1 font-medium transition-colors"
                onClick={() => dispatch(setSignInPop(true))}
              >
                <p className="hidden md:inline-block">登入</p>
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 md:hidden" />
              </button>
              {/* 註冊 */}
              <button
                type="button"
                className="hidden md:flex items-center rounded-full ml-2 p-2 md:px-4 md:py-1 font-medium text-ink-soft border border-line-strong hover:text-brand hover:border-brand transition-colors"
                onClick={() => dispatch(setSignUpPop(true))}
              >
                <p className="hidden md:inline-block">註冊</p>
                <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5 md:hidden" />
              </button>
            </div>
          )}
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
