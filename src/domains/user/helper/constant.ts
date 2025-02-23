export const IdTypeAllowed = {
  REG_NO: 'REG_NO',
  BUSINESS_NO: 'BUSINESS_NO',
} as const;

export type IdType = (typeof IdTypeAllowed)[keyof typeof IdTypeAllowed];
