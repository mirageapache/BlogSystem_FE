import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// --- components ---
import App from './App';
import store from './redux/configStore';
// --- styles ---
import './index.css';
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// Vite 以 import.meta.env.BASE_URL 提供部署 base path（對應 vite.config 的 base，預設 '/'）
const basename = import.meta.env.BASE_URL;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
