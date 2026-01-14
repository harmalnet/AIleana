import type {
  accountStatus,
  authTypes,
  callStatus,
  callType,
  currencyType,
  paymentMethod,
  paymentStatus,
  paymentType,
  signalType,
  transactionStatus,
  transactionType,
  userRole,
  walletStatus,
  walletTransactionStatus,
  walletTransactionType,
} from './constants';

export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
  ...arguments_: Arguments
) => T;

export type ObjectValues<T> = T[keyof T];

// User types
export type UserRoleType = ObjectValues<typeof userRole>;
export type AuthType = ObjectValues<typeof authTypes>;
export type AccountStatus = ObjectValues<typeof accountStatus>;

// Payment types
export type PaymentStatus = ObjectValues<typeof paymentStatus>;
export type PaymentType = ObjectValues<typeof paymentType>;
export type PaymentMethod = ObjectValues<typeof paymentMethod>;
export type CurrencyType = ObjectValues<typeof currencyType>;
export type TransactionStatus = ObjectValues<typeof transactionStatus>;
export type TransactionType = ObjectValues<typeof transactionType>;

// Call types
export type CallStatus = ObjectValues<typeof callStatus>;
export type CallType = ObjectValues<typeof callType>;
export type SignalType = ObjectValues<typeof signalType>;

// Wallet types
export type WalletStatus = ObjectValues<typeof walletStatus>;
export type WalletTransactionType = ObjectValues<typeof walletTransactionType>;
export type WalletTransactionStatus = ObjectValues<
  typeof walletTransactionStatus
>;

// Pagination interfaces
export interface IPaginationOptions {
  page: number;
  limit: number;
  hasPagination: boolean;
  [x: string]: number | string | boolean;
}

export interface IPaginationMeta {
  count: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// API Response interfaces
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IPaginationMeta;
}

// JWT Payload interface
export interface IJwtPayload {
  sub: string;
  email: string;
  role?: UserRoleType;
  iat?: number;
  exp?: number;
}

// Monnify webhook payload
export interface IMonnifyWebhook {
  transactionReference: string;
  paymentReference: string;
  amountPaid: number;
  totalPayable: number;
  paymentStatus: string;
  paidOn?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

// Call signaling data
export interface ISignalData {
  type: SignalType;
  data?: any;
  from?: string;
  to?: string;
  timestamp?: Date;
}

// Wallet transaction detail
export interface IWalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  reference: string;
  description?: string;
  createdAt: Date;
}

// Call session detail
export interface ICallSessionDetail {
  id: string;
  sessionId: string;
  callerId: string;
  receiverId: string;
  callType: CallType;
  status: CallStatus;
  duration: number;
  totalCost: number;
  ratePerMinute: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

// Request user interface (for JWT auth)
export interface IRequestUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: UserRoleType;
  wallet?: {
    id: string;
    balance: number;
    currency: string;
  };
}
