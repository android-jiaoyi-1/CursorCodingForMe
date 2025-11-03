import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStockStore } from '../../stores/useStockStore';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const { balance } = useStockStore();
  const selectedKey = location.pathname.startsWith('/trade')
    ? 'trade'
    : location.pathname.startsWith('/history')
    ? 'history'
    : 'market';

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 600 }}>
        <div style={{ flex: 1 }}>股票交易模拟平台</div>
        <Typography.Text style={{ color: '#fff' }}>余额：{balance.toFixed(2)}</Typography.Text>
      </Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
              { key: 'market', label: <Link to="/">行情</Link> },
              { key: 'trade', label: <Link to="/trade">交易</Link> },
              { key: 'history', label: <Link to="/history">历史记录</Link> },
            ]}
          />
        </Sider>
        <Content style={{ padding: 16, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};


