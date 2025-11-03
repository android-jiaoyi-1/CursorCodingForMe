import { KLineData, Stock, Transaction, TimePoint } from '@/types/stock';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateStocks(count = 25): Stock[] {
  const list: Stock[] = [];
  for (let i = 0; i < count; i++) {
    const code = 'S' + String(100000 + i);
    const price = Number(randomBetween(5, 150).toFixed(2));
    const change = Number(randomBetween(-5, 5).toFixed(2));
    const volume = Math.floor(randomBetween(10000, 500000));
    // 根据当前价格和涨跌幅计算昨日收盘价
    const previousClose = Number((price / (1 + change / 100)).toFixed(2));
    // 普通股票涨跌停幅度为10%
    const limitPercent = 0.1;
    list.push({ code, name: `股票${i + 1}`, currentPrice: price, change, volume, previousClose, limitPercent });
  }
  return list;
}

export function generateKline(days = 90, basePrice = 30): KLineData[] {
  const data: KLineData[] = [];
  let lastClose = basePrice;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = randomBetween(-0.06, 0.06);
    const open = lastClose;
    const close = Number((open * (1 + change)).toFixed(2));
    const high = Math.max(open, close) * (1 + randomBetween(0, 0.02));
    const low = Math.min(open, close) * (1 - randomBetween(0, 0.02));
    const volume = Math.floor(randomBetween(100000, 900000));
    data.push({
      date: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume,
    });
    lastClose = close;
  }
  return data;
}

export function generateTransactions(count = 10): Transaction[] {
  const arr: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const price = Number(randomBetween(10, 50).toFixed(2));
    const quantity = Math.floor(randomBetween(100, 2000) / 100) * 100;
    arr.push({
      id: String(i + 1),
      stockCode: 'S100000',
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      price,
      quantity,
      timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
    });
  }
  return arr;
}

export function generateIntradaySeries(basePrice: number, minutes = 120): TimePoint[] {
  const points: TimePoint[] = [];
  let price = basePrice;
  let sum = 0;
  for (let i = 0; i < minutes; i++) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - (minutes - i));
    price = Number((price * (1 + (Math.random() - 0.5) * 0.004)).toFixed(2));
    sum += price;
    const avg = Number((sum / (i + 1)).toFixed(2));
    const vol = Math.floor(1000 + Math.random() * 5000);
    points.push({ time: d.toTimeString().slice(0, 5), price, avg, vol });
  }
  return points;
}

export function nextIntradayTick(prev: TimePoint[], lastPrice: number): { series: TimePoint[]; price: number } {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  const drift = (Math.random() - 0.5) * 0.004; // 单位分钟随机波动
  const price = Number((lastPrice * (1 + drift)).toFixed(2));
  const sum = prev.reduce((s, p) => s + p.price, 0) + price;
  const avg = Number((sum / (prev.length + 1)).toFixed(2));
  const vol = Math.floor(1000 + Math.random() * 5000);
  const next = [...prev.slice(-119), { time, price, avg, vol }];
  return { series: next, price };
}


