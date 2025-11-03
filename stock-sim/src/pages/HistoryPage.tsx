import React, { useMemo, useState } from 'react';
import { Card, DatePicker, Table } from 'antd';
import { useStockStore } from '../stores/useStockStore';
import dayjs, { Dayjs } from 'dayjs';

export const HistoryPage: React.FC = () => {
  const { transactions } = useStockStore();
  const [date, setDate] = useState<Dayjs | null>(null);
  const data = useMemo(() => {
    const list = date
      ? transactions.filter((t) => dayjs(t.timestamp).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'))
      : transactions;
    return list.map((t) => ({
      key: t.id,
      time: dayjs(t.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      stock: `${t.stockCode} ${t.stockName}`,
      type: t.type,
      price: t.price,
      quantity: t.quantity,
    }));
  }, [transactions, date]);

  return (
    <Card title="交易记录">
      <DatePicker allowClear onChange={(d) => setDate(d)} style={{ marginBottom: 12 }} />
      <Table
        size="small"
        columns={[
          { title: '时间', dataIndex: 'time' },
          { title: '股票', dataIndex: 'stock' },
          { title: '方向', dataIndex: 'type' },
          { title: '价格', dataIndex: 'price' },
          { title: '数量', dataIndex: 'quantity' },
        ]}
        dataSource={data}
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
};


