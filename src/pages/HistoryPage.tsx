import { Card, DatePicker, Table } from 'antd';
import { useStockStore } from '@/stores/useStockStore';
import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export function HistoryPage() {
  const { init, transactions } = useStockStore();
  const [date, setDate] = useState<Dayjs | null>(null);
  useEffect(() => { init(); }, [init]);

  const filtered = useMemo(() => {
    if (!date) return transactions;
    const dayStr = date.format('YYYY-MM-DD');
    return transactions.filter(t => t.timestamp.slice(0, 10) === dayStr);
  }, [transactions, date]);

  return (
    <div>
      <Card title="对账单筛选">
        <DatePicker value={date} onChange={setDate} />
      </Card>
      <Card title="交易记录" style={{ marginTop: 16 }}>
        <Table
          rowKey={(r) => r.id}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: '时间', dataIndex: 'timestamp' },
            { title: '股票', dataIndex: 'stockCode' },
            { title: '方向', dataIndex: 'type' },
            { title: '价格', dataIndex: 'price', render: (v) => `¥${v.toFixed(2)}` },
            { title: '数量', dataIndex: 'quantity' },
          ]}
        />
      </Card>
    </div>
  );
}


