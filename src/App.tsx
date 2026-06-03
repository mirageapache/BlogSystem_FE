import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
// --- constants ---
import {
  SIDEBAR_FRAME,
  SIDEBAR_CONTAINER_FRAME,
  BOTTOM_MENU_FRAME,
} from 'constants/LayoutConstants';
// --- components ---
import BottomMenu from 'components/layout/BottomMenu';
import ModalSection from 'components/layout/ModalSection';
import Header from 'components/layout/Header';
import SideBar from 'components/layout/SideBar';
import SignInPopup from 'components/login/SignInPopup';
import SignUpPopup from 'components/login/SignUpPopup';
import FindPassword from 'components/login/FindPassword';

// --- pages ---
import ResetPassword from 'pages/ResetPassword';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PostDetailPage from './pages/post/PostDetailPage';
import ArticleDetailPage from './pages/aritcle/ArticleDetailPage';
import UserProfilePage from './pages/user/UserProfilePage';
import EditProfilePage from './pages/user/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ArticleCreatePage from './pages/aritcle/ArticleCreatePage';

// --- functions / types ---
import { SysStateType } from './redux/sysSlice';
import { LoginStateType } from './redux/loginSlice';
import { getMe } from './api/auth';
import { UserStateType, setUserData } from './redux/userSlice';
import { UserProfileType } from './types/userType';
import { handleStatus } from './utils/fetch';
import { GUEST_USER_DATA } from './constants/StringConstants';

/** stateType  */
interface StateType {
  system: SysStateType;
  login: LoginStateType;
  user: UserStateType;
}

function App() {
  const sliceDispatch = useDispatch();
  const sysState = useSelector((state: StateType) => state.system);
  const loginState = useSelector((state: StateType) => state.login);
  const userState = useSelector((state: StateType) => state.user);
  const userData = get(userState, 'userData', {});
  const userId = get(userData, 'userId', '');

  /** 判斷是否已有使用者資料，若無則向後端確認
   * 訪客 token 後端不會回傳完整 user data，前端用固定 GUEST_USER_DATA 顯示
   * 用 ignore flag 避免快速登出/重登時舊回應覆蓋新 state
   */
  useEffect(() => {
    if (!isEmpty(userData) || !isEmpty(userId)) return undefined;
    if (!localStorage.getItem('hasSession')) return undefined;

    let ignore = false;
    (async () => {
      const res = await getMe();
      if (ignore) return;
      if (handleStatus(get(res, 'status', 0)) === 2) {
        const rawData = get(res, 'data');
        // 後端登入回傳格式為 { userData: {...} }，與 SignIn 保持一致
        // 若 rawData 直接是 user object（userId 在頂層），也支援
        const user = get(rawData, 'userData') || rawData;
        if (isEmpty(user) || isEmpty(get(user, 'userId'))) {
          sliceDispatch(setUserData(GUEST_USER_DATA));
        } else {
          sliceDispatch(setUserData(user as UserProfileType));
        }
      } else {
        // 4xx = 未登入或 token 失效，清掉 localStorage flag 避免下次重試
        localStorage.removeItem('hasSession');
      }
    })();

    return () => {
      ignore = true;
    };
  }, [userId, userData]);

  return (
    <div className={`font-sans ${sysState.darkMode}`}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="mb-auto mt-[52px] sm:mt-16 flex-grow flex justify-center">
          <div className="w-full flex justify-between">
            <section className={SIDEBAR_FRAME}>
              <SideBar />
            </section>
            <section className={SIDEBAR_CONTAINER_FRAME}>
              <Routes>
                {/* WebSite */}
                <Route path="/" element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />

                {/* Article */}
                <Route path="article/:id" element={<ArticleDetailPage />} />
                <Route path="article/create" element={<ArticleCreatePage />} />
                {/* Post */}
                <Route path="post/:id" element={<PostDetailPage />} />

                {/* User */}
                <Route path="user/profile/:userId" element={<UserProfilePage />} />
                <Route path="user/editProfile" element={<EditProfilePage />} />

                {/* Reset PWD */}
                <Route path="reset_password/:token" element={<ResetPassword />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </section>
            <section className={BOTTOM_MENU_FRAME}>
              <BottomMenu />
            </section>
          </div>
        </main>

        <ModalSection />
        {/* 登入&註冊 Popup */}
        {loginState.showSignInPop && <SignInPopup />}
        {loginState.showSignUpPop && <SignUpPopup />}
        {loginState.showForgetPwd && <FindPassword />}
      </div>
    </div>
  );
}

export default App;
