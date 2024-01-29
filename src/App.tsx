import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// --- components ---
import Header from 'components/Header';
import Footer from 'components/Footer';
// --- pages ---
import HomePage from 'pages/HomePage';
import PostDetailPage from 'pages/PostDetailPage';

function App() {
  const [darkMode, setDarkMode] = useState('');
  return (
    <div className={`font-sans ${darkMode} `}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mb-auto mt-16 flex-grow flex justify-center">
          <div className="w-full sm:min-w-[640px] flex justify-between">
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
