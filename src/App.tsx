import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { MarketPage } from './pages/MarketPage';
import { TradePage } from './pages/TradePage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  const [activeKey, setActiveKey] = useState('market');

  return (
    <MainLayout
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
    >
      {activeKey === 'market' && <MarketPage />}
      {activeKey === 'trade' && <TradePage />}
      {activeKey === 'history' && <HistoryPage />}
    </MainLayout>
  );
}


