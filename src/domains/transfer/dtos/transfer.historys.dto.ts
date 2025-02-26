import { Expose, Transform } from 'class-transformer';

export class TransferHistorysDto {
  @Expose()
  sourceAmount: number;

  @Expose()
  fee: number;

  @Expose()
  usdExchangeRate: number;

  @Expose()
  usdAmount: number;

  @Expose()
  targetCurrency: string;

  @Expose()
  exchangeRate: number;

  @Expose()
  targetAmount: number;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T').join(' '))
  requestedDate: string;
}
