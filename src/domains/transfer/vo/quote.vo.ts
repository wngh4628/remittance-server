import { DateTimeBaseVo } from '../../../core/base/date.time.vo';
import { CreateQuoteDto } from '../dtos/\bcreate.quote.dto';
import { QuoteDto } from '../dtos/response.quote.dto';
import { Quote } from '../entities/quote.entity';
import { TargetCurrency } from '../helper/constant';
import { BadRequestException } from '@nestjs/common';

export class QuoteVO extends DateTimeBaseVo {
  sendingAmount: number;
  receivingAmount: number;
  targetCurrency: TargetCurrency;
  fee: number;
  exchangeRate: number;
  expireTime: Date;
  usdExchangeRate?: number;
  targetCurrencyToUSD?: number;
  usdAmount: number;

  constructor(dto: CreateQuoteDto) {
    super();
    if (!Number.isInteger(dto.amount) || dto.amount < 1) {
      throw new BadRequestException('NEGATIVE_NUMBER');
    }

    this.sendingAmount = dto.amount;
    this.targetCurrency = dto.targetCurrency;
    this.usdExchangeRate = dto.krwToUsd; // KRW → USD 환율 (예: 1301.01)

    // USD일 경우 targetCurrencyToUSD를 1로 설정
    this.targetCurrencyToUSD =
      dto.targetCurrency === 'USD' ? 1 : dto.targetCurrencyToUSD;

    // 수수료 계산 적용
    this.fee = this.calculateFee(dto.amount, dto.targetCurrency);
    const amountAfterFee = dto.amount - this.fee;

    // KRW → USD 변환
    this.usdAmount = amountAfterFee / this.usdExchangeRate;

    // USD → TargetCurrency 변환
    this.receivingAmount = this.usdAmount * this.targetCurrencyToUSD;

    // KRW → TargetCurrency 환율 계산
    this.exchangeRate = parseFloat(
      (amountAfterFee / this.receivingAmount).toFixed(3),
    );

    //  견적 만료 시간: 현재 시간 + 10분
    this.expireTime = new Date(new Date().getTime() + 10 * 60000);
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
      expireTime: this.formatToKST(this.expireTime),
      targetAmount: parseFloat(this.receivingAmount.toFixed(2)),
    };
  }

  toEntity(userIdx: number): Quote {
    const quote = new Quote();
    quote.userIdx = userIdx;
    quote.sourceAmount = this.sendingAmount;
    quote.targetCurrency = this.targetCurrency;
    quote.exchangeRate = this.exchangeRate;
    quote.expireTime = this.expireTime;
    quote.targetAmount = parseFloat(this.receivingAmount.toFixed(2));
    quote.usdExchangeRate = this.usdExchangeRate;
    quote.fee = this.fee;
    quote.usdAmount = this.usdAmount;

    return quote;
  }
}
