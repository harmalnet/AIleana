export const walletStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Suspended: 'suspended',
  Locked: 'locked',
} as const;

export const walletTransactionType = {
  Credit: 'credit',
  Debit: 'debit',
} as const;

export const walletTransactionStatus = {
  Pending: 'pending',
  Completed: 'completed',
  Failed: 'failed',
  Reversed: 'reversed',
} as const;
