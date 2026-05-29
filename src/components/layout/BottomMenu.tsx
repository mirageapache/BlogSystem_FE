import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { get, isEmpty } from 'lodash';
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

      {isEmpty(userId) ? (
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
        // 已登入狀態 => 顯示建立(文章、貼文)&個人頁面
        <>
          {!checkVisitor() && (
            <button
              aria-label="user"
              type="button"
              className="w-1/3 flex justify-center py-3 cursor-pointer"
              onClick={() => {
                if (guardVisitorAction()) return;
                sliceDispatch(setShowCreateModal(true));
              }}
            >
              <FontAwesomeIcon
                icon={icon({ name: 'square-plus', style: 'solid' })}
                className="w-5 h-5 text-gray-500"
              />
            </button>
          )}
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
        </>
      )}
    </div>
  );
}

export default BottomMenu;
