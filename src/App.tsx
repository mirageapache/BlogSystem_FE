import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import HomePage from 'pages/HomePage';

function App() {
  const [darkMode, setDarkMode] = useState('');

  return (
    <div className={`App font-mono ${darkMode} `}>
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mb-auto flex-grow">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/about" element={<About />} /> */}
            </Routes>
          </BrowserRouter>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
