export const TargetCurrencyAllowed = {
  USD: 'USD',
  JPY: 'JPY',
} as const;

export type TargetCurrency =
  (typeof TargetCurrencyAllowed)[keyof typeof TargetCurrencyAllowed];
