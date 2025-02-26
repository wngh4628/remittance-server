import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestQuoteDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quoteId: number;
}
