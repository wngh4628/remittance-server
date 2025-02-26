export const TargetCurrencyAllowed = {
  USD: 'USD',
  JPY: 'JPY',
} as const;

export type TargetCurrency =
  (typeof TargetCurrencyAllowed)[keyof typeof TargetCurrencyAllowed];

export const TransferStatusAllowed = {
  INITIATED: 'INITIATED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
} as const;

export type TransferStatus =
  (typeof TransferStatusAllowed)[keyof typeof TransferStatusAllowed];
