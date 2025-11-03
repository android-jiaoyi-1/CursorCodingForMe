import React, { useEffect } from 'react';
import { Card, List, Typography } from 'antd';
import { useStockStore } from '../stores/useStockStore';
import { Link } from 'react-router-dom';

export const MarketPage: React.FC = () => {
  const { stockList, tickPrices, setCurrentStock } = useStockStore();
  useEffect(() => {
    const id = setInterval(() => tickPrices(), 1500);
    return () => clearInterval(id);
  }, [tickPrices]);

  return (
    <Card title="自选/市场列表">
      <List
        dataSource={stockList}
        renderItem={(s) => (
          <List.Item actions={[<Link key="trade" to="/trade" onClick={() => setCurrentStock(s.code)}>交易</Link>] }>
            <List.Item.Meta
              title={`${s.code} ${s.name}`}
              description={
                <>
                  <Typography.Text>价格：{s.currentPrice.toFixed(2)}</Typography.Text>
                  <Typography.Text style={{ marginLeft: 12 }} type={s.change >= 0 ? 'success' : 'danger'}>
                    涨跌：{(s.change * 100).toFixed(2)}%
                  </Typography.Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};


