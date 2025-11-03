import { Row, Col, Card } from 'antd';
import { useStockStore } from '@/stores/useStockStore';
import { useEffect } from 'react';
import { KLineChart } from '@/components/charts/KLineChart';
import { TradePanel } from '@/components/trade/TradePanel';
import { PositionList } from '@/components/trade/PositionList';

export function TradePage() {
  const { init, klineData } = useStockStore();
  useEffect(() => { init(); }, [init]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="K线图">
            <KLineChart data={klineData} />
          </Card>
        </Col>
        <Col span={8}>
          <TradePanel />
        </Col>
      </Row>
      <PositionList />
    </div>
  );
}


