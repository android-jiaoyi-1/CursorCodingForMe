export interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  change: number; // percent, e.g. 1.23 means +1.23%
  volume: number;
}

export interface KLineData {
  date: string; // yyyy-MM-dd
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface Transaction {
  id: string;
  stockCode: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: string; // ISO string
}

export interface Position {
  stockCode: string;
  stockName: string;
  quantity: number;
  costPrice: number;
}

export interface TimePoint {
  time: string; // HH:mm
  price: number;
  avg: number;
  vol: number;
}


