export function calcAmount(price: number, quantity: number): number {
  return +(price * quantity).toFixed(2);
}

export function calcFee(amount: number, rate = 0.001): number {
  return +(amount * rate).toFixed(2);
}

export function formatMoney(value: number): string {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 0) return 0;
  return Math.floor(quantity);
}


