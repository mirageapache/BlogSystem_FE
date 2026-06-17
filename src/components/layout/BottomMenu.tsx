import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSquarePlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// --- functions / types ---
import { checkVisitor, guardVisitorAction, scrollToTop } from 'utils/common';
import { SysStateType, setActivePage } from '../../redux/sysSlice';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
import { setShowCreateModal } from '../../redux/postSlice';

interface StateType {
  system: SysStateType;
  user: UserStateType;
}

function BottomMenu() {
  const sliceDispatch = useDispatch();
  const systemState = useSelector((state: StateType) => state.system);
  const userId = useSelector((state: StateType) => state.user.userData?.userId);
  const activePage = get(systemState, 'activePage');

  const isHome = activePage === '' || activePage === 'home';
  const iconClass = (active: boolean) =>
    `w-6 h-6 transition-colors ${active ? 'text-brand' : 'text-muted'}`;
  const linkClass = 'w-1/3 flex justify-center items-center h-full cursor-pointer';

  return (
    <div className="w-full h-full flex items-center">
      {/* home page */}
      <Link
        to="/"
        className={linkClass}
        onClick={() => {
          sliceDispatch(setActivePage('home'));
          scrollToTop();
        }}
      >
        <FontAwesomeIcon icon={faHome} className={iconClass(isHome)} />
      </Link>

      {/* explore page */}
      <Link
        to="/explore"
        className={linkClass}
        onClick={() => {
          sliceDispatch(setActivePage('explore'));
          scrollToTop();
        }}
      >
        <FontAwesomeIcon icon={faCompass} className={iconClass(activePage === 'explore')} />
      </Link>

      {isEmpty(userId) ? (
        // 未登入狀態 => 登入功能
        <button
          aria-label="user"
          type="button"
          className={linkClass}
          onClick={() => {
            sliceDispatch(setSignInPop(true));
          }}
        >
          <FontAwesomeIcon icon={faUser} className={iconClass(false)} />
        </button>
      ) : (
        // 已登入狀態 => 顯示建立(文章、貼文)&個人頁面
        <>
          {!checkVisitor() && (
            <button
              aria-label="user"
              type="button"
              className={linkClass}
              onClick={() => {
                if (guardVisitorAction()) return;
                sliceDispatch(setShowCreateModal(true));
              }}
            >
              <FontAwesomeIcon icon={faSquarePlus} className={iconClass(false)} />
            </button>
          )}
          <Link
            to={`/user/profile/${userId}`}
            className={linkClass}
            onClick={() => {
              sliceDispatch(setActivePage('user'));
              scrollToTop();
            }}
          >
            <FontAwesomeIcon icon={faUser} className={iconClass(activePage === 'user')} />
          </Link>
        </>
      )}
    </div>
  );
}

export default BottomMenu;
