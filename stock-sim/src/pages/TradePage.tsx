import React, { useMemo } from 'react';
import { Col, Row, Segmented } from 'antd';
import { TradePanel } from '../components/trade/TradePanel';
import { PositionList } from '../components/trade/PositionList';
import { useStockStore } from '../stores/useStockStore';
import { KLineChart } from '../components/charts/KLineChart';
import { TimeSharingChart } from '../components/charts/TimeSharingChart';

export const TradePage: React.FC = () => {
  const { currentStock, klineData } = useStockStore();
  const [mode, setMode] = React.useState<'k' | 'time'>('k');

  const timePoints = useMemo(() => {
    // mock intraday points based on kline close
    const base = klineData.at(-1)?.close ?? 100;
    const points = Array.from({ length: 60 }, (_, i) => {
      const noise = (Math.random() - 0.5) * 0.6;
      const price = +(base + noise).toFixed(2);
      return { time: `${9 + Math.floor(i / 6)}:${(i % 6) * 10}`.padStart(5, '0'), price, avg: base, volume: Math.floor(Math.random() * 1e5) };
    });
    return points;
  }, [klineData]);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <TradePanel />
        <div style={{ marginTop: 16 }}>
          <PositionList />
        </div>
      </Col>
      <Col span={16}>
        <Segmented
          style={{ marginBottom: 8 }}
          options={[{ label: 'K线', value: 'k' }, { label: '分时', value: 'time' }]}
          value={mode}
          onChange={(v) => setMode(v as any)}
        />
        {mode === 'k' ? <KLineChart data={klineData} /> : <TimeSharingChart points={timePoints} />}
        {!currentStock && <div style={{ marginTop: 8 }}>请选择一只股票开始交易与查看图表</div>}
      </Col>
    </Row>
  );
};


