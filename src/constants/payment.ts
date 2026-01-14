export const paymentStatus = {
  Pending: 'pending',
  Success: 'success',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;

export const paymentType = {
  WalletFunding: 'wallet_funding',
  CallCharge: 'call_charge',
} as const;

export const paymentMethod = {
  Monnify: 'monnify',
  Card: 'card',
  BankTransfer: 'bank_transfer',
  Wallet: 'wallet',
} as const;

export const currencyType = {
  NGN: 'NGN',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;

export const transactionStatus = {
  Pending: 'pending',
  Success: 'success',
  Failed: 'failed',
  Reversed: 'reversed',
} as const;

export const transactionType = {
  Credit: 'credit',
  Debit: 'debit',
} as const;
