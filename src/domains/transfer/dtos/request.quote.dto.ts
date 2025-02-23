import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { TargetCurrency } from '../helper/constant';
import { HttpErrorConstants } from '../helper/http.error.objects';

export class RequestQuoteDto {
  @IsNotEmpty()
  @IsInt(HttpErrorConstants.NEGATIVE_NUMBER)
  @Min(1, HttpErrorConstants.NEGATIVE_NUMBER)
  amount: number;

  @IsNotEmpty()
  targetCurrency: TargetCurrency;
}
