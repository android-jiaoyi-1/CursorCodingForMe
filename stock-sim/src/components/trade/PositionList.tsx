import React, { useMemo } from 'react';
import { Card, Table, Typography } from 'antd';
import { useStockStore } from '../../stores/useStockStore';

export const PositionList: React.FC = () => {
  const { positions, stockList } = useStockStore();
  const data = useMemo(() => {
    return positions.map((p) => {
      const cur = stockList.find((s) => s.code === p.stockCode);
      const pnl = cur ? (cur.currentPrice - p.costPrice) * p.quantity : 0;
      const pnlPct = cur ? (cur.currentPrice - p.costPrice) / p.costPrice : 0;
      return {
        key: p.stockCode,
        code: p.stockCode,
        name: p.stockName,
        quantity: p.quantity,
        costPrice: p.costPrice,
        currentPrice: cur?.currentPrice ?? '-',
        pnl: +pnl.toFixed(2),
        pnlPct: +(pnlPct * 100).toFixed(2),
      };
    });
  }, [positions, stockList]);

  return (
    <Card title="当前持仓">
      <Table
        size="small"
        columns={[
          { title: '代码', dataIndex: 'code' },
          { title: '名称', dataIndex: 'name' },
          { title: '数量', dataIndex: 'quantity' },
          { title: '成本价', dataIndex: 'costPrice' },
          { title: '现价', dataIndex: 'currentPrice' },
          { title: '浮动盈亏', dataIndex: 'pnl', render: (v: number) => <Typography.Text type={v >= 0 ? 'success' : 'danger'}>{v}</Typography.Text> },
          { title: '盈亏%', dataIndex: 'pnlPct', render: (v: number) => <Typography.Text type={v >= 0 ? 'success' : 'danger'}>{v}%</Typography.Text> },
        ]}
        dataSource={data}
        pagination={false}
      />
    </Card>
  );
};


