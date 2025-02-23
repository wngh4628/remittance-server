import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class QuoteDto {
  @IsNotEmpty()
  @IsString()
  quoteId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  exchangeRate: number;

  @IsNotEmpty()
  @IsString()
  expireTime: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  targetAmount: number;
}
