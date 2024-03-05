import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
// --- components ---
import Header from './components/Header';
import SideBar from './components/SideBar';

// --- pages ---
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PostDetailPage from './pages/PostDetailPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import UserProfilePage from './pages/user/UserProfilePage';

function App() {
  const [darkMode, setDarkMode] = useState('');
  return (
    <div className={`font-sans ${darkMode} `}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mb-auto mt-16 flex-grow flex justify-center">
          <div className="w-full flex justify-between">
            <div className={SIDEBAR_FRAME}>
              <SideBar />
            </div>
            <div className={SIDEBAR_CONTAINER_FRAME}>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
