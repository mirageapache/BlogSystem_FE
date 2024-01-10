import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import HomePage from 'pages/HomePage';
import PostDetailPage from 'pages/PostDetailPage';

function App() {
  const [darkMode, setDarkMode] = useState('');
  
  return (
    <div className={`font-mono ${darkMode} `}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mb-auto flex-grow flex justify-center">
          <div className="w-full sm:min-w-[640px] md:max-w-[768px] xl:max-w-6xl flex justify-between py-2 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/post/:id" element={<PostDetailPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
