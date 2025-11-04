import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { KLineData, Position, Stock, Transaction, TimePoint } from '@/types/stock';
import { generateIntradaySeries, generateKline, generateStocks, generateTransactions, nextIntradayTick } from '@/utils/mockData';

interface StockStore {
  balance: number;
  positions: Position[];
  transactions: Transaction[];

  stockList: Stock[];
  currentStock: Stock | null;
  klineData: KLineData[];
  intradayMap: Record<string, TimePoint[]>;
  openPriceMap: Record<string, number>;
  _timer?: number;

  buyStock: (code: string, quantity: number) => void;
  sellStock: (code: string, quantity: number) => void;
  setCurrentStock: (code: string) => void;
  init: () => void;
  cleanup: () => void; // 修复：添加清理方法
}

export const useStockStore = create<StockStore>()(
  immer((set, get) => ({
    balance: 100000,
    positions: [],
    transactions: [],

    stockList: [],
    currentStock: null,
    klineData: [],
    intradayMap: {},
    openPriceMap: {},

    init: () => {
      const stockList = generateStocks(25);
      const currentStock = stockList[0] ?? null;
      const klineData = generateKline(90, currentStock?.currentPrice ?? 30);
      const intradayMap: Record<string, TimePoint[]> = {};
      const openPriceMap: Record<string, number> = {};
      stockList.forEach(s => {
        intradayMap[s.code] = generateIntradaySeries(s.currentPrice, 60);
        openPriceMap[s.code] = s.currentPrice;
      });
      const transactions = generateTransactions(8);
      set((state) => {
        state.stockList = stockList;
        state.currentStock = currentStock;
        state.klineData = klineData;
        state.transactions = transactions;
        state.intradayMap = intradayMap;
        state.openPriceMap = openPriceMap;
      });
      // 启动实时更新定时器
      const tick = () => {
        const st = get();
        const updatedIntradayMap: Record<string, TimePoint[]> = {};
        const updatedStockList = st.stockList.map(s => {
          const prevSeries = st.intradayMap[s.code] ?? [];
          const last = prevSeries[prevSeries.length - 1]?.price ?? s.currentPrice;
          const { series, price } = nextIntradayTick(prevSeries, last);
          updatedIntradayMap[s.code] = series; // 修复：收集更新后的数据，不要直接修改state
          const open = st.openPriceMap[s.code] ?? price;
          const change = Number((((price - open) / open) * 100).toFixed(2));
          return { ...s, currentPrice: price, change };
        });
        set((state) => {
          state.stockList = updatedStockList;
          state.intradayMap = { ...state.intradayMap, ...updatedIntradayMap }; // 修复：通过set更新intradayMap
          if (state.currentStock) {
            const cs = updatedStockList.find(x => x.code === state.currentStock!.code) || state.currentStock;
            state.currentStock = cs;
          }
        });
      };
      // 先清一次避免重复
      if (get()._timer) {
        window.clearInterval(get()._timer);
      }
      const id = window.setInterval(tick, 1000);
      set((state) => { state._timer = id; });
    },

    setCurrentStock: (code) => {
      const stock = get().stockList.find((s) => s.code === code) ?? null;
      if (!stock) return;
      set((state) => {
        state.currentStock = stock;
        state.klineData = generateKline(90, stock.currentPrice);
      });
    },

    buyStock: (code, quantity) => {
      const stock = get().stockList.find((s) => s.code === code);
      if (!stock) return;
      const amount = stock.currentPrice * quantity;
      const fee = amount * 0.001;
      const total = amount + fee;
      if (get().balance < total) return;
      set((state) => {
        state.balance -= Number(total.toFixed(2));
        const pos = state.positions.find((p) => p.stockCode === code);
        if (pos) {
          const newQty = pos.quantity + quantity;
          pos.costPrice = Number(((pos.costPrice * pos.quantity + stock.currentPrice * quantity) / newQty).toFixed(2));
          pos.quantity = newQty;
        } else {
          state.positions.push({ stockCode: stock.code, stockName: stock.name, quantity, costPrice: stock.currentPrice });
        }
        state.transactions.unshift({
          id: String(Date.now()),
          stockCode: code,
          type: 'buy',
          price: stock.currentPrice,
          quantity,
          timestamp: new Date().toISOString(),
        });
      });
    },

    sellStock: (code, quantity) => {
      const stock = get().stockList.find((s) => s.code === code);
      if (!stock) return;
      set((state) => {
        const pos = state.positions.find((p) => p.stockCode === code);
        if (!pos || pos.quantity < quantity) return;
        pos.quantity -= quantity;
        const amount = stock.currentPrice * quantity;
        const fee = amount * 0.001;
        const total = amount - fee;
        state.balance += Number(total.toFixed(2));
        if (pos.quantity === 0) {
          state.positions = state.positions.filter((p) => p.stockCode !== code);
        }
        state.transactions.unshift({
          id: String(Date.now()),
          stockCode: code,
          type: 'sell',
          price: stock.currentPrice,
          quantity,
          timestamp: new Date().toISOString(),
        });
      });

    cleanup: () => {
      const timer = get()._timer;
      if (timer) {
        window.clearInterval(timer); // 修复：清理定时器
        set((state) => { state._timer = undefined; });
      }
    },
  }))
);


