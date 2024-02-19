import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// --- components ---
import Header from './components/Header';
// --- pages ---
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PostDetailPage from './pages/PostDetailPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

function App() {
  const [darkMode, setDarkMode] = useState('');
  return (
    <div className={`font-sans ${darkMode} `}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mb-auto mt-16 flex-grow flex justify-center">
          <div className="w-full sm:min-w-[640px]">
            <Routes>
              {/* WebSite */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Post */}
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/article/:id" element={<ArticleDetailPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
