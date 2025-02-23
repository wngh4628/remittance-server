import { RequestQuoteDto } from '../dtos/request.quote.dto';
import { QuoteDto } from '../dtos/response.quote.dto';
import { Quote } from '../entities/quote.entity';
import { TargetCurrency } from '../helper/constant';
import { BadRequestException } from '@nestjs/common';

export class TransferVO {
  sendingAmount: number;
  receivingAmount: number;
  targetCurrency: TargetCurrency;
  fee: number;
  exchangeRate: number;
  expirationTime: Date;

  constructor(dto: RequestQuoteDto, exchangeRate) {
    if (!Number.isInteger(dto.amount) || dto.amount < 1) {
      throw new BadRequestException('NEGATIVE_NUMBER');
    }

    this.sendingAmount = dto.amount;
    this.targetCurrency = dto.targetCurrency;
    this.exchangeRate = exchangeRate;

    // 수수료 계산 적용
    this.fee = this.calculateFee(dto.amount, dto.targetCurrency);
    
    // 받는 금액 계산
    this.receivingAmount = (this.sendingAmount - this.fee) / this.exchangeRate;
    console.log('this.receivingAmount: ', this.receivingAmount);
    // 견적 만료 시간: 현재 시간 + 10분
    this.expirationTime = new Date(new Date().getTime() + 10 * 60000);
  }

  /**
   *  통화별 수수료 계산 로직
   */
  private calculateFee(amount: number, currency: TargetCurrency): number {
    switch (currency) {
      case 'USD':
        return amount > 1000000
          ? amount * 0.001 + 3000 // 100만원 초과 → 수수료율 0.1%, 고정 3000원
          : amount * 0.002 + 1000; // 100만원 이하 → 수수료율 0.2%, 고정 1000원

      case 'JPY':
        return amount * 0.005 + 3000; // 고정 3000엔, 수수료율 0.5%
    }
  }
  getQuote(quoteId: number): QuoteDto {
    return {
      quoteId: quoteId,
      exchangeRate: this.exchangeRate,
      expireTime: this.expirationTime,
      targetAmount: parseFloat(this.receivingAmount.toFixed(2)),
    };
  }

  toEntity(userIdx: number): Quote {
    const quote = new Quote();
    quote.userIdx = userIdx;
    quote.amount = this.sendingAmount;
    quote.targetCurrency = this.targetCurrency;
    quote.exchangeRate = this.exchangeRate;
    quote.expireTime = this.expirationTime;
    quote.targetAmount = parseFloat(this.receivingAmount.toFixed(2));
    return quote;
  }
}
