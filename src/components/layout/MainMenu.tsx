import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
// --- components ---
import AuthorInfoPanel from 'components/user/AuthorInfoPanel';
// --- functions / types ---
import { setDarkMode } from '../../redux/sysSlice';

/** Toggle Menu 參數型別 */
type ItemPropsType = {
  href: string;
  text: string;
  count: number;
  children: ReactNode;
};

interface MainMenuType {
  toggleMenuAnimation: string;
  setToggleMenuAnimation: (value: string) => void;
}

/** MainMenu Item 元件 */
function MenuItem({ href, text, count, children }: ItemPropsType) {
  return (
    <a
      href={href}
      className="flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-3"
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

/** MainMenu 元件 */
function MainMenu({ toggleMenuAnimation, setToggleMenuAnimation }: MainMenuType) {
  const isLogin = !isEmpty(localStorage.getItem('authToken'));
  const dispatch = useDispatch();

  return (
    <div className="fixed">
      <button
        type="button"
        className={`w-full h-full top-0 left-0 text-transparent ${
          toggleMenuAnimation === 'translate-x-full' ? 'none' : 'fixed'
        }`}
        onClick={() => setToggleMenuAnimation('translate-x-full')}
      >
        x
      </button>
      <div
        className={`fixed z-30 top-0 right-0 w-full sm:max-w-[300px] h-full flex flex-col transform duration-300 ease-in-out ${toggleMenuAnimation} bg-white opacity-95 dark:bg-gray-950 dark:opacity-[0.98] border-l-[1px] border-gray-300 dark:border-gray-700`}
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
        {isLogin && (
          <div className="mx-5 border-b-[1px] border-gray-400 dark:border-gray-700">
            <AuthorInfoPanel avatarUrl="" />
          </div>
        )}
        <div className="h-full py-5 px-8 opacity-100">
          <div className="text-left h-fit sm:px-1 px-5">
            <div className="ml-2.5">
              <MenuItem href="/" text="首頁" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'home' })} />
              </MenuItem>
              <MenuItem href="/explore" text="探索" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'compass', style: 'regular' })} />
              </MenuItem>
              <MenuItem href="/search" text="搜尋" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'search', style: 'solid' })} />
              </MenuItem>
              {/* 以下選項須判斷是否登入 */}
              <MenuItem href="/inbox" text="訊息匣" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'inbox' })} />
              </MenuItem>
              <MenuItem href="/activity" text="動態" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'bell', style: 'regular' })} />
              </MenuItem>
              <MenuItem href="/write" text="撰寫文章" count={0}>
                <FontAwesomeIcon icon={icon({ name: 'pen', style: 'solid' })} />
              </MenuItem>
            </div>
          </div>
        </div>
        <div className="flex p-5 border-t-[1px] border-gray-300 dark:border-gray-700">
          {/* 快速設定 */}
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

          {/* 修改登出鈕樣式 */}
          <button
            aria-label="logout"
            type="button"
            className="w-14 h-7 flex items-center border border-gray-400 rounded-full px-2 bg-gray-150 dark:bg-gray-700"
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.reload();
            }}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'right-from-bracket', style: 'solid' })}
              className="h-5 w-5 text-gray-900 translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
export default MainMenu;
