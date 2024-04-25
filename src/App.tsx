import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
// --- components ---
import Header from './components/layout/Header';
import SideBar from './components/layout/SideBar';
import SignInPopup from './components/login/SignInPopup';
import SignUpPopup from './components/login/SignUpPopup';

// --- pages ---
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PostDetailPage from './pages/PostDetailPage';
import ArticleDetailPage from './pages/aritcle/ArticleDetailPage';
import UserProfilePage from './pages/user/UserProfilePage';

// --- functions / types ---
import { SysStateType } from './redux/sysSlice';
import { SearchStateType } from './redux/searchSlice';
import { LoginStateType } from './redux/loginSlice';
import { getCookies } from './utils/common';
import { getOwnProfile } from './api/user';
import { UserStateType, setUserData } from './redux/userSlice';
import EditProfilePage from 'pages/user/EditProfilePage';

/** stateType  */
interface StateType {
  system: SysStateType;
  search: SearchStateType;
  login: LoginStateType;
  user: UserStateType;
}

function App() {
  const sliceDispatch = useDispatch();
  const sysState = useSelector((state: StateType) => state.system);
  const loginState = useSelector((state: StateType) => state.login);
  const userState = useSelector((state: StateType) => state.user);

  /** getUserData */
  const getUserData = async (userId: string) => {
    const res = await getOwnProfile(userId);
    if (res.status === 200) {
      sliceDispatch(
        setUserData({
          ...res.data,
          theme: 0,
        })
      );
    }
  };

  /** 判斷是否有儲存authToken及uid */
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || '';
    const uid = getCookies('uid');
    const { userId } = userState.userData;
    if (!isEmpty(authToken) && !isEmpty(uid) && isEmpty(userId)) {
      // 判斷redex中沒有userData，且有cookie及authToken再執行
      getUserData(uid!);
    }
  }, []);

  return (
    <div className={`font-sans ${sysState.darkMode}`}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="mb-auto mt-16 flex-grow flex justify-center">
          <div className="w-full flex justify-between">
            <section className={SIDEBAR_FRAME}>
              <SideBar />
            </section>
            <section className={SIDEBAR_CONTAINER_FRAME}>
              <Routes>
                {/* WebSite */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                {/* Post / Article */}
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/article/:id" element={<ArticleDetailPage />} />
                {/* User */}
                <Route path="/profile/:userId" element={<UserProfilePage />} />
                <Route path="/editProfile" element={<EditProfilePage />} />
              </Routes>
            </section>
          </div>
        </main>

        {/* 登入&註冊 Popup */}
        {loginState.showSignInPop && <SignInPopup />}
        {loginState.showSignUpPop && <SignUpPopup />}
      </div>
    </div>
  );
}

export default App;
