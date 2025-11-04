import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Flex, InputNumber, Radio, Row, Select, Space, Statistic, message } from 'antd';
import { useStockStore } from '../../stores/useStockStore';
import { calcAmount, calcFee, clampQuantity, formatMoney } from '../../utils/calculation';

export const TradePanel: React.FC = () => {
  const { stockList, currentStock, setCurrentStock, balance, buyStock, sellStock } = useStockStore();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number>(0);

  const options = useMemo(
    () => stockList.map((s) => ({ value: s.code, label: `${s.code} ${s.name}` })),
    [stockList]
  );

  const price = currentStock?.currentPrice ?? 0;
  const amount = calcAmount(price, quantity);
  const fee = calcFee(amount, 0.001);

  const onQuick = (ratio: number) => {
    if (mode === 'buy') {
      const maxQty = Math.floor(balance / price);
      setQuantity(clampQuantity(maxQty * ratio));
    } else {
      const pos = useStockStore.getState().positions.find((p) => p.stockCode === currentStock?.code);
      const maxQty = pos?.quantity ?? 0;
      setQuantity(clampQuantity(maxQty * ratio));
    }
  };

  const onSubmit = () => {
    if (!currentStock) return message.warning('请先选择股票');
    if (quantity <= 0) return message.warning('数量必须大于0');
    const err = mode === 'buy'
      ? buyStock(currentStock.code, quantity)
      : sellStock(currentStock.code, quantity);
    if (err) message.error(err);
    else {
      message.success(`${mode === 'buy' ? '买入' : '卖出'}成功`);
      setQuantity(0);
    }
  };

  return (
    <Card title="交易面板" bodyStyle={{ paddingTop: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Select
          showSearch
          placeholder="搜索股票代码/名称"
          optionFilterProp="label"
          options={options}
          value={currentStock?.code}
          onChange={(v) => setCurrentStock(v)}
          filterSort={(a, b) => (a?.label as string).localeCompare(b?.label as string)}
        />

        <Row gutter={16}>
          <Col span={8}><Statistic title="当前价格" value={price} precision={2} /></Col>
          <Col span={8}><Statistic title="涨跌幅" value={(currentStock?.change ?? 0) * 100} precision={2} suffix="%" /></Col>
          <Col span={8}><Statistic title="可用资金" value={formatMoney(balance)} /></Col>
        </Row>

        <Flex gap={16} align="center" wrap>
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio.Button value="buy">买入</Radio.Button>
            <Radio.Button value="sell">卖出</Radio.Button>
          </Radio.Group>
          <InputNumber min={0} value={quantity} onChange={(v) => setQuantity(clampQuantity(Number(v)))} />
          <Space>
            <Button onClick={() => onQuick(0.25)}>1/4</Button>
            <Button onClick={() => onQuick(0.5)}>1/2</Button>
            <Button onClick={() => onQuick(1)}>全部</Button>
          </Space>
          <Button type={mode === 'buy' ? 'primary' : 'default'} danger={mode === 'sell'} onClick={onSubmit}>
            {mode === 'buy' ? '买入' : '卖出'}
          </Button>
        </Flex>

        <Row gutter={16}>
          <Col span={8}><Statistic title="交易金额" value={amount} precision={2} /></Col>
          <Col span={8}><Statistic title="手续费(0.1%)" value={fee} precision={2} /></Col>
          <Col span={8}><Statistic title="实付/实收" value={mode === 'buy' ? amount + fee : amount - fee} precision={2} /></Col>
        </Row>
      </Space>
    </Card>
  );
};


