import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class QuoteDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quoteId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  exchangeRate: number;

  @IsNotEmpty()
  @IsString()
  expireTime: Date | string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  targetAmount: number;
}
