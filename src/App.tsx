import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
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


/** stateType  */
interface StateType {
  system: SysStateType;
  search: SearchStateType;
  login: LoginStateType;
}

function App() {
  const sysState = useSelector((state: StateType) => state.system);
  const loginState = useSelector((state: StateType) => state.login);
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
                <Route path="/profile/:id" element={<UserProfilePage />} />
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
