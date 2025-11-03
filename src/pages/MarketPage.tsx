import { Card, Input, List, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useStockStore } from '@/stores/useStockStore';
import { TimeSharingChart } from '@/components/charts/TimeSharingChart';

export function MarketPage() {
  const { stockList, currentStock, setCurrentStock, init, intradayMap, klineData } = useStockStore();
  const [q, setQ] = useState('');

  useEffect(() => { init(); }, [init]);

  const list = useMemo(() => {
    if (!q) return stockList;
    const lq = q.toLowerCase();
    return stockList.filter(s => s.code.toLowerCase().includes(lq) || s.name.toLowerCase().includes(lq));
  }, [q, stockList]);

  // 获取昨日收盘价（从K线数据中获取最后一天的收盘价）
  const yesterdayClosePrice = useMemo(() => {
    if (klineData.length === 0) return undefined;
    // 获取最后一天的收盘价作为昨日收盘价
    const lastKLine = klineData[klineData.length - 1];
    return lastKLine.close;
  }, [klineData]);

  return (
    <div>
      <Card title="分时图">
        {currentStock && <TimeSharingChart data={intradayMap[currentStock.code] || []} yesterdayClosePrice={yesterdayClosePrice} />}
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


