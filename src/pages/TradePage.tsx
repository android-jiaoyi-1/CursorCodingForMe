import { Row, Col, Card } from 'antd';
import { useStockStore } from '@/stores/useStockStore';
import { useEffect } from 'react';
import { KLineChart } from '@/components/charts/KLineChart';
import { TradePanel } from '@/components/trade/TradePanel';
import { PositionList } from '@/components/trade/PositionList';
import { TimeSharingChart } from '@/components/charts/TimeSharingChart';

export function TradePage() {
  const { init, klineData, bsPoints, currentStock, intradayMap } = useStockStore();
  useEffect(() => { init(); }, [init]);

  const intradayData = currentStock ? intradayMap[currentStock.code] || [] : [];

  return (
    <div>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="K线图">
            <KLineChart data={klineData} bsPoints={bsPoints} stockCode={currentStock?.code} />
          </Card>
        </Col>
        <Col span={8}>
          <TradePanel />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="分时图">
            <TimeSharingChart data={intradayData} bsPoints={bsPoints} stockCode={currentStock?.code} />
          </Card>
        </Col>
      </Row>
      <PositionList />
    </div>
  );
}


