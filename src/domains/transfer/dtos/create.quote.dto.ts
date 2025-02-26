import { IsNotEmpty, Min } from 'class-validator';

import { TargetCurrency } from '../helper/constant';
import { HttpErrorConstants } from '../helper/http.error.objects';
import { Type } from 'class-transformer';

export class CreateQuoteDto {
  @Min(0, HttpErrorConstants.NEGATIVE_NUMBER)
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  targetCurrency: TargetCurrency;

  krwToUsd?: number = 0;
  targetCurrencyToUSD?: number = 0;
}
