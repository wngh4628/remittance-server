export const IdTypeAllowed = {
  REG_NO: 'REG_NO',
  BUSINESS_NO: 'BUSINESS_NO',
} as const;

export type IdType = (typeof IdTypeAllowed)[keyof typeof IdTypeAllowed];

export const DailyLimit = {
  REG_NO: 1000000, // 개인 회원 일일 제한 금액 1백만원
  BUSINESS_NO: 5000000, // 법인 회원 일일 제한 금액 5백만원
} as const;
