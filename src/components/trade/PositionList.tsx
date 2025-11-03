import { Card, Table } from 'antd';
import { useMemo } from 'react';
import { useStockStore } from '@/stores/useStockStore';

export function PositionList() {
  const { positions, stockList } = useStockStore();

  const data = useMemo(() => positions.map(p => {
    const cur = stockList.find(s => s.code === p.stockCode);
    const pnl = cur ? (cur.currentPrice - p.costPrice) * p.quantity : 0;
    return {
      key: p.stockCode,
      code: p.stockCode,
      name: p.stockName,
      quantity: p.quantity,
      costPrice: p.costPrice,
      currentPrice: cur?.currentPrice ?? 0,
      pnl,
    };
  }), [positions, stockList]);

  return (
    <Card title="持仓列表" style={{ marginTop: 16 }}>
      <Table
        dataSource={data}
        pagination={false}
        columns={[
          { title: '代码', dataIndex: 'code' },
          { title: '名称', dataIndex: 'name' },
          { title: '数量', dataIndex: 'quantity' },
          { title: '成本价', dataIndex: 'costPrice', render: (v) => `¥${v.toFixed(2)}` },
          { title: '现价', dataIndex: 'currentPrice', render: (v) => `¥${v.toFixed(2)}` },
          { title: '浮动盈亏', dataIndex: 'pnl', render: (v) => `¥${v.toFixed(2)}` },
        ]}
      />
    </Card>
  );
}


