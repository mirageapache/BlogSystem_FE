import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import Header from 'components/Header';

function App() {
  const [darkMode, setDarkMode] = useState('');

  return (
    <div className={`App font-mono ${darkMode} `}>
      <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <BrowserRouter>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
