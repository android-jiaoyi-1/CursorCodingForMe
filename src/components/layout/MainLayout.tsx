import { Layout, Menu, Typography } from 'antd';
import { ReactNode } from 'react';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  activeKey: string;
  onChange: (key: string) => void;
  children: ReactNode;
}

export function MainLayout({ activeKey, onChange, children }: MainLayoutProps) {
  return (
    <Layout className="app-layout">
      <Header style={{ color: '#fff', fontSize: 16 }}>股票交易模拟平台</Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={[
              { key: 'market', label: '行情' },
              { key: 'trade', label: '交易' },
              { key: 'history', label: '历史记录' },
            ]}
            onClick={(e) => onChange(e.key)}
          />
        </Sider>
        <Layout style={{ padding: 16 }}>
          <Content className="content-wrapper">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}


