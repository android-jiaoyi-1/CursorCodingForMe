export function calculateAmount(price: number, quantity: number): number {
  return Number((price * quantity).toFixed(2));
}

export function calculateFee(amount: number): number {
  return Number((amount * 0.001).toFixed(2)); // 0.1%
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


