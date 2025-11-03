import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MarketPage } from './pages/MarketPage';
import { TradePage } from './pages/TradePage';
import { HistoryPage } from './pages/HistoryPage';
import { MainLayout } from './components/layout/MainLayout';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}> 
          <Route index element={<MarketPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
