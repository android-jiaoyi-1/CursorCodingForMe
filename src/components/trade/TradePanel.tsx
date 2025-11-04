import { Button, Card, Col, Divider, InputNumber, Row, Select, Space, Statistic, Tag, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useStockStore } from '@/stores/useStockStore';
import { calculateAmount, calculateFee, formatCurrency } from '@/utils/calculation';

export function TradePanel() {
  const { stockList, currentStock, setCurrentStock, balance, buyStock, sellStock } = useStockStore();
  const [quantity, setQuantity] = useState<number>(100);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  useEffect(() => {
    if (!currentStock && stockList.length > 0) setCurrentStock(stockList[0].code);
  }, [currentStock, stockList, setCurrentStock]);

  const amount = useMemo(() => calculateAmount(currentStock?.currentPrice ?? 0, quantity || 0), [currentStock, quantity]);
  const fee = useMemo(() => calculateFee(amount), [amount]);
  const actionText = side === 'buy' ? '买入' : '卖出';

  const handleQuick = (ratio: number) => {
    if (!currentStock) return;
    if (side === 'buy') {
      const maxQty = Math.floor((balance / (currentStock.currentPrice * (1 + 0.001))) / 100) * 100;
      setQuantity(Math.max(100, Math.floor((maxQty * ratio) / 100) * 100));
    } else {
      const pos = useStockStore.getState().positions.find(p => p.stockCode === currentStock.code);
      const qty = Math.floor(((pos?.quantity ?? 0) * ratio / 100) / 100) * 100;
      setQuantity(Math.max(100, qty));
    }
  };

  const submit = () => {
    if (!currentStock) return;
    if (!quantity || quantity <= 0 || quantity % 100 !== 0) {
      message.error('数量需为正数且为100的整数倍');
      return;
    }
    if (side === 'buy') {
      const total = amount + fee;
      if (total > balance) {
        message.error('资金不足');
        return;
      }
      buyStock(currentStock.code, quantity);
      message.success(`${actionText}成功`);
    } else {
      const pos = useStockStore.getState().positions.find(p => p.stockCode === currentStock.code);
      if (!pos || pos.quantity < quantity) {
        message.error('可用持仓不足');
        return;
      }
      sellStock(currentStock.code, quantity);
      message.success(`${actionText}成功`);
    }
  };

  return (
    <Card title="股票交易">
      <Row gutter={16}>
        <Col span={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              showSearch
              placeholder="搜索股票代码/名称"
              optionFilterProp="label"
              value={currentStock?.code}
              onChange={(v) => setCurrentStock(v)}
              options={stockList.map(s => ({ value: s.code, label: `${s.code} ${s.name}` }))}
              filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
            />
            <Space>
              <Button type={side === 'buy' ? 'primary' : 'default'} onClick={() => setSide('buy')}>买入</Button>
              <Button type={side === 'sell' ? 'primary' : 'default'} danger onClick={() => setSide('sell')}>卖出</Button>
            </Space>
            <Space wrap>
              <Button onClick={() => handleQuick(25)}>1/4</Button>
              <Button onClick={() => handleQuick(50)}>1/2</Button>
              <Button onClick={() => handleQuick(100)}>全部</Button>
            </Space>
            <InputNumber addonBefore="数量" addonAfter="股" min={100} step={100} value={quantity} onChange={(v) => setQuantity(Number(v))} style={{ width: '100%' }} />
            <Button type="primary" onClick={submit}>提交{actionText}</Button>
          </Space>
        </Col>
        <Col span={16}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="当前价格" value={currentStock?.currentPrice ?? 0} precision={2} prefix="¥" />
            </Col>
            <Col span={8}>
              <Statistic title="涨跌幅" value={currentStock?.change ?? 0} precision={2} suffix="%" valueStyle={{ color: (currentStock?.change ?? 0) >= 0 ? '#3f8600' : '#cf1322' }} />
            </Col>
            <Col span={8}>
              <Statistic title="可用资金" value={balance} precision={2} prefix="¥" />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={8}><Statistic title="交易金额" value={amount} precision={2} prefix="¥" /></Col>
            <Col span={8}><Statistic title="手续费(0.1%)" value={fee} precision={2} prefix="¥" /></Col>
            <Col span={8}><Statistic title="合计" value={side === 'buy' ? amount + fee : amount - fee} precision={2} prefix="¥" /></Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}


