import { create } from 'zustand';
import type { KLineData, Position, Stock, Transaction } from '../types/stock';
import { generateKLine, generateStockList, nextTickPrice } from '../utils/mockData';

interface StockStore {
  balance: number;
  positions: Position[];
  transactions: Transaction[];

  stockList: Stock[];
  currentStock: Stock | null;
  klineData: KLineData[];

  setCurrentStock: (code: string) => void;
  buyStock: (code: string, quantity: number, price?: number) => string | null;
  sellStock: (code: string, quantity: number, price?: number) => string | null;
  tickPrices: () => void;
}

export const useStockStore = create<StockStore>((set, get) => ({
  balance: 100000,
  positions: [],
  transactions: [],

  stockList: generateStockList(20),
  currentStock: null,
  klineData: [],

  setCurrentStock: (code) => {
    const { stockList } = get();
    const found = stockList.find((s) => s.code === code) || null;
    const kline = found ? generateKLine(90, found.currentPrice) : [];
    set({ currentStock: found, klineData: kline });
  },

  buyStock: (code, quantity, price) => {
    const state = get();
    const stock = state.stockList.find((s) => s.code === code);
    if (!stock) return '未找到该股票';
    const tradePrice = price ?? stock.currentPrice;
    const cost = tradePrice * quantity;
    const fee = cost * 0.001;
    const total = +(cost + fee).toFixed(2);
    if (total > state.balance) return '可用资金不足';
    const positions = [...state.positions];
    const idx = positions.findIndex((p) => p.stockCode === code);
    if (idx >= 0) {
      const p = positions[idx];
      const newQty = p.quantity + quantity;
      const newCost = (p.costPrice * p.quantity + tradePrice * quantity) / newQty;
      positions[idx] = { ...p, quantity: newQty, costPrice: +newCost.toFixed(2) };
    } else {
      positions.push({ stockCode: code, stockName: stock.name, quantity, costPrice: tradePrice });
    }
    const tx: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      stockCode: code,
      stockName: stock.name,
      type: 'buy',
      price: tradePrice,
      quantity,
      timestamp: Date.now(),
    };
    set({
      positions,
      balance: +(state.balance - total).toFixed(2),
      transactions: [tx, ...state.transactions],
    });
    return null;
  },

  sellStock: (code, quantity, price) => {
    const state = get();
    const stock = state.stockList.find((s) => s.code === code);
    if (!stock) return '未找到该股票';
    const idx = state.positions.findIndex((p) => p.stockCode === code);
    if (idx < 0) return '无可卖持仓';
    const pos = state.positions[idx];
    if (quantity > pos.quantity) return '卖出数量大于持仓数量';
    const tradePrice = price ?? stock.currentPrice;
    const proceeds = tradePrice * quantity;
    const fee = proceeds * 0.001;
    const net = +(proceeds - fee).toFixed(2);
    const newPositions = [...state.positions];
    if (quantity === pos.quantity) newPositions.splice(idx, 1);
    else newPositions[idx] = { ...pos, quantity: pos.quantity - quantity };
    const tx: Transaction = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      stockCode: code,
      stockName: stock.name,
      type: 'sell',
      price: tradePrice,
      quantity,
      timestamp: Date.now(),
    };
    set({
      positions: newPositions,
      balance: +(state.balance + net).toFixed(2),
      transactions: [tx, ...state.transactions],
    });
    return null;
  },

  tickPrices: () => {
    const { stockList, currentStock } = get();
    const updated = stockList.map((s) => {
      const newPrice = nextTickPrice(s.currentPrice);
      const change = (newPrice - s.currentPrice) / Math.max(0.01, s.currentPrice);
      return { ...s, currentPrice: newPrice, change };
    });
    const cur = currentStock ? updated.find((s) => s.code === currentStock.code) || null : null;
    set({ stockList: updated, currentStock: cur || null });
  },
}));


