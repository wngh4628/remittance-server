import { HttpException, HttpStatus } from '@nestjs/common';
import { Quote } from '../entities/quote.entity';
import { Transfer } from '../entities/transfer.entity';
import { TargetCurrency, TransferStatusAllowed } from '../helper/constant';

export class TransferVO {
  quoteId: number;
  userIdx: number;
  targetCurrency: TargetCurrency;
  amount: number;
  targetAmount: number;

  constructor(quote: Quote) {
    if (quote.status == TransferStatusAllowed.COMPLETED) {
      throw new HttpException(
        '이미 처리가 완료된 요청입니다.',
        HttpStatus.CONFLICT,
      );
    }
    const expireTime = new Date(quote.expireTime); // 만료 시간
    const currentTime = new Date(); // 현재 시간

    const diffInMinutes =
      (currentTime.getTime() - expireTime.getTime()) / (1000 * 60);

    if (diffInMinutes > 10) {
      throw new HttpException('견적서가 만료 되었습니다.', HttpStatus.GONE);
    }
    this.quoteId = quote.quoteId;
    this.userIdx = quote.userIdx;
    this.targetCurrency = quote.targetCurrency;
    this.amount = quote.sourceAmount;
    this.targetAmount = quote.targetAmount;
  }

  toEntity(): Transfer {
    const transfer = new Transfer();
    transfer.quoteId = this.quoteId;
    transfer.userIdx = this.userIdx;
    transfer.amount = this.amount;
    transfer.targetCurrency = this.targetCurrency;
    transfer.status = TransferStatusAllowed.COMPLETED;
    return transfer;
  }
}
