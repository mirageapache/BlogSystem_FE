import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { get, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

// --- functions / types ---
import { scrollToTop } from 'utils/common';
import { SysStateType, setActivePage } from '../../redux/sysSlice';
import { setSignInPop } from '../../redux/loginSlice';

interface StateType {
  system: SysStateType;
}

function BottomMenu() {
  const sliceDispatch = useDispatch();
  const systemState = useSelector((state: StateType) => state.system);
  const [cookies] = useCookies(['uid']);
  const userId = cookies.uid; // 設定userId，判斷有沒有登入
  // const [activeTab, setActiveTab] = useState('home');
  const activePage = get(systemState, 'activePage');

  return (
    <div className="w-full h-full flex items-center">
      {/* home page */}
      <Link
        to="/"
        className="w-1/3 flex justify-center py-3 cursor-pointer"
        onClick={() => {
          sliceDispatch(setActivePage('home'));
          scrollToTop();
        }}
      >
        <FontAwesomeIcon
          icon={icon({ name: 'home', style: 'solid' })}
          className={`w-5 h-5 text-gray-500 ${activePage === '' ? 'text-orange-500' : ''}  ${
            activePage === 'home' ? 'text-orange-500' : ''
          }`}
        />
      </Link>

      {/* explore page */}
      <Link
        to="/explore"
        className="w-1/3 flex justify-center py-3 cursor-pointer"
        onClick={() => {
          sliceDispatch(setActivePage('explore'));
          scrollToTop();
        }}
      >
        <FontAwesomeIcon
          icon={icon({ name: 'compass', style: 'regular' })}
          className={`w-5 h-5 text-gray-500  ${activePage === 'explore' ? 'text-orange-500' : ''}`}
        />
      </Link>

      {isEmpty(localStorage.getItem('authToken')) ? (
        // 未登入狀態 => 登入功能
        <button
          aria-label="user"
          type="button"
          className="w-1/3 flex justify-center py-3 cursor-pointer"
          onClick={() => {
            sliceDispatch(setSignInPop(true));
          }}
        >
          <FontAwesomeIcon
            icon={icon({ name: 'user', style: 'solid' })}
            className="w-5 h-5 text-gray-500"
          />
        </button>
      ) : (
        // 已登入狀態 => 個人頁面
        <Link
          to={`/user/profile/${userId}`}
          className="w-1/3 flex justify-center py-3 cursor-pointer"
          onClick={() => {
            sliceDispatch(setActivePage('user'));
            scrollToTop();
          }}
        >
          <FontAwesomeIcon
            icon={icon({ name: 'user', style: 'solid' })}
            className={`w-5 h-5 text-gray-500 ${activePage === 'user' ? 'text-orange-500' : ''}`}
          />
        </Link>
      )}
    </div>
  );
}

export default BottomMenu;
