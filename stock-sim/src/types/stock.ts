export interface Stock {
  code: string;
  name: string;
  currentPrice: number;
  change: number; // percentage, e.g., 0.012 = +1.2%
  volume: number;
}

export interface KLineData {
  date: string; // YYYY-MM-DD
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface Position {
  stockCode: string;
  stockName: string;
  quantity: number;
  costPrice: number;
}

export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  stockCode: string;
  stockName: string;
  type: TransactionType;
  price: number;
  quantity: number;
  timestamp: number; // epoch ms
}


