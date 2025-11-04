import { Card, Input, List, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useStockStore } from '@/stores/useStockStore';
import { TimeSharingChart } from '@/components/charts/TimeSharingChart';

export function MarketPage() {
  const { stockList, currentStock, setCurrentStock, init, cleanup, intradayMap } = useStockStore();
  const [q, setQ] = useState('');

  useEffect(() => {
    init();
    return () => {
      cleanup(); // 修复：组件卸载时清理定时器
    };
  }, [init, cleanup]);

  const list = useMemo(() => {
    if (!q) return stockList;
    const lq = q.toLowerCase();
    return stockList.filter(s => s.code.toLowerCase().includes(lq) || s.name.toLowerCase().includes(lq));
  }, [q, stockList]);

  return (
    <div>
      <Card title="分时图">
        {currentStock && <TimeSharingChart data={intradayMap[currentStock.code] || []} />}
      </Card>
      <Card title="自选列表" style={{ marginTop: 16 }}>
        <Input.Search placeholder="搜索股票" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
        <List
          dataSource={list}
          renderItem={(item) => (
            <List.Item onClick={() => setCurrentStock(item.code)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta title={`${item.code} ${item.name}`} description={`价格：¥${item.currentPrice.toFixed(2)}`} />
              <Tag color={item.change >= 0 ? 'green' : 'red'}>{item.change.toFixed(2)}%</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}


