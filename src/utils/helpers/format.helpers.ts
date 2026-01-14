/**
 * Format a numeric amount with thousand separators and 2 decimal places
 * Example: 20500 → "20,500.00"
 */
export function formatAmount(amount: number | string): string {
  const numericAmount =
    typeof amount === 'string' ? Number.parseFloat(amount) : Number(amount);

  if (Number.isNaN(numericAmount)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Format currency with amount
 * Example: (20500, 'NGN') → "NGN 20,500.00"
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
): string {
  return `${currency.toUpperCase()} ${formatAmount(amount)}`;
}
