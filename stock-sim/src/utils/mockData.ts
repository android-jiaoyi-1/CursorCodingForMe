import type { KLineData, Stock, Transaction } from '../types/stock';

const STOCK_NAMES = [
  ['600000', '浦发银行'],
  ['600519', '贵州茅台'],
  ['601318', '中国平安'],
  ['000001', '平安银行'],
  ['000651', '格力电器'],
  ['300750', '宁德时代'],
  ['601398', '工商银行'],
  ['601988', '中国银行'],
  ['000333', '美的集团'],
  ['600036', '招商银行'],
  ['600104', '上汽集团'],
  ['000858', '五粮液'],
  ['600703', '三安光电'],
  ['600690', '海尔智家'],
  ['002415', '海康威视'],
  ['600760', '中航沈飞'],
  ['600009', '上海机场'],
  ['601888', '中国中免'],
  ['603288', '海天味业'],
  ['002475', '立讯精密'],
];

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateStockList(count = 20): Stock[] {
  const list: Stock[] = [];
  const picked = STOCK_NAMES.slice(0, count);
  for (const [code, name] of picked) {
    const base = randomBetween(10, 500);
    const change = randomBetween(-0.05, 0.05);
    const currentPrice = +(base * (1 + change)).toFixed(2);
    // 根据当前价格和涨跌幅计算昨日收盘价
    const previousClose = +(base).toFixed(2);
    // 普通股票涨跌停幅度为10%
    const limitPercent = 0.1;
    list.push({
      code,
      name,
      currentPrice,
      change,
      volume: Math.floor(randomBetween(1e5, 1e7)),
      previousClose,
      limitPercent,
    });
  }
  return list;
}

export function generateKLine(days = 90, startPrice?: number): KLineData[] {
  const data: KLineData[] = [];
  let price = startPrice ?? randomBetween(20, 200);
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const open = price;
    const high = open * (1 + randomBetween(0, 0.03));
    const low = open * (1 - randomBetween(0, 0.03));
    const close = randomBetween(low, high);
    const volume = Math.floor(randomBetween(5e4, 5e6));
    price = close;
    data.push({
      date: date.toISOString().slice(0, 10),
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      volume,
    });
  }
  return data;
}

export function generateTransactions(): Transaction[] {
  return [];
}

export function nextTickPrice(prev: number): number {
  const drift = 0.0005; // small upward drift
  const vol = 0.005; // volatility
  const r = (Math.random() - 0.5) * vol * 2 + drift;
  const p = +(prev * (1 + r)).toFixed(2);
  return Math.max(0.01, p);
}


