import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import axios from 'axios';

import { TraceTemplate } from '../../core/template/trace.template';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { TRANSFER_TRACE } from './helper/trace.constant';
import { QuoteRepository } from './repositories/quote.repository';
import { QuoteDto } from './dtos/response.quote.dto';
import { CreateQuoteDto } from './dtos/\bcreate.quote.dto';
import { TransferRepository } from './repositories/transfer.repository';
import { TransferVO } from './vo/transfer.vo';
import { QuoteVO } from './vo/quote.vo';
import { DailyLimit, IdType, IdTypeAllowed } from '../user/helper/constant';
import { TransferStatusAllowed } from './helper/constant';
import { HttpErrorConstants } from './helper/http.error.objects';
import { RequestTransferHistoryDto } from './dtos/request.transfer.history.dto';
import { TransferHistoryVo } from './vo/transfer.history.vo';
import { User } from '../user/entities/user.entity';
import { TransferHistorysDto } from './dtos/transfer.historys.dto';

@Injectable()
export class TransferService {
  constructor(
    private quoteRepository: QuoteRepository,
    private transferRepository: TransferRepository,
    private readonly traceTemplate: TraceTemplate,
  ) {}

  @TraceExecution(TRANSFER_TRACE.GET_TRANSFER_QUOTE_SERVICE)
  async getTransferQuote(
    dto: CreateQuoteDto,
    userIdx: number,
  ): Promise<QuoteDto> {
    await this.getExchangeRate(dto);
    const quoteVO = new QuoteVO(dto);
    const quoteEntity = quoteVO.toEntity(userIdx);
    const result = await this.quoteRepository.save(quoteEntity);
    return quoteVO.getQuote(result.quoteId);
  }

  async getExchangeRate(dto: CreateQuoteDto): Promise<CreateQuoteDto> {
    const result = await axios({
      method: 'GET',
      url: `${process.env.EXCHANGE_RATE_API_URL}/forex/recent?codes=,FRX.${dto.targetCurrency}USD,FRX.KRWUSD`,
    });

    for (const data of result.data) {
      if (data.code == `FRX.KRWUSD`) {
        dto.krwToUsd = data.basePrice / data.currencyUnit;
      } else if (data.code == `FRX.${dto.targetCurrency}USD`) {
        dto.targetCurrencyToUSD = data.basePrice / data.currencyUnit;
      }
    }
    return dto;
  }

  @TraceExecution(TRANSFER_TRACE.GET_TRANSFER_QUOTE_SERVICE)
  @Transactional()
  async requestTransferQuote(quoteId: number, userIdx: number, idType: IdType) {
    const quoteData = await this.quoteRepository.findOne({
      where: { quoteId },
    });
    const transferVO = new TransferVO(quoteData);
    await this.checkTodayTransferLimit(quoteData.sourceAmount, userIdx, idType);

    const transferEntity = transferVO.toEntity();
    await this.transferRepository.save(transferEntity);
    quoteData.status = TransferStatusAllowed.COMPLETED;
    await this.quoteRepository.save(quoteData);
    return true;
  }

  async checkTodayTransferLimit(
    amount: number,
    userIdx: number,
    idType: IdType,
  ) {
    const todayTransferSum = (
      await this.todayTransferSumAndCnt(amount, userIdx)
    ).todayTransferCount;

    if (
      idType === IdTypeAllowed.REG_NO &&
      todayTransferSum >= DailyLimit.REG_NO
    ) {
      throw new HttpException(
        {
          ...HttpErrorConstants.LIMIT_EXCESS,
          resultCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      idType === IdTypeAllowed.BUSINESS_NO &&
      todayTransferSum >= DailyLimit.BUSINESS_NO
    ) {
      throw new HttpException(
        {
          ...HttpErrorConstants.LIMIT_EXCESS,
          resultCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async todayTransferSumAndCnt(amount: number, userIdx: number) {
    // 오늘 송금 내역 조회
    const todayHistory =
      await this.transferRepository.todayUserTransferHistory(userIdx);

    // 총 송금액 계산
    const resultSum = todayHistory.reduce(
      (sum, transfer) => {
        // transfer.amount를 정수 단위로 변환 (소숫점 2자리 기준)
        const amountInCents = Math.round(Number(transfer.amount) * 100);
        return sum + amountInCents;
      },
      Math.round(amount * 100),
    );
    // 최종 결과 반환 (객체로 리턴)
    const todayTransferSum = parseFloat((resultSum / 100).toFixed(2));
    return {
      todayTransferSum,
      todayTransferCount: todayHistory.length,
    };
  }

  @TraceExecution(TRANSFER_TRACE.GET_USER_TRANSCTION_HISTORY_SERVICE)
  async getUserTransactionHistory(dto: RequestTransferHistoryDto, user: User) {
    const transferHistoryVo = new TransferHistoryVo(dto, user);
    const transferHistory =
      await this.transferRepository.getUserTransactionHistory(
        transferHistoryVo,
        user.idx,
      );
    const { todayTransferSum, todayTransferCount } =
      this.todayTransferUsdSumAndCnt(transferHistory);
    transferHistoryVo.history = transferHistory;
    return transferHistoryVo.toJson(todayTransferSum, todayTransferCount);
  }

  // 오늘 하루 보낸 USD 달러 총합 구하는 함수
  todayTransferUsdSumAndCnt(todayHistory: TransferHistorysDto[]) {
    // 오늘 날짜 (YYYY-MM-DD 포맷)
    const today = new Date().toISOString().split('T')[0];

    // 오늘 날짜인 데이터만 필터링
    const todayTransfers = todayHistory.filter((transfer) => {
      const transferDate = new Date(transfer.requestedDate)
        .toISOString()
        .split('T')[0];
      return transferDate === today;
    });

    // 총 송금액 계산
    const resultSum = todayTransfers.reduce((sum, transfer) => {
      const amount =
        typeof transfer.usdAmount === 'string'
          ? parseFloat(transfer.usdAmount)
          : transfer.usdAmount;

      // 숫자가 아니거나, null/undefined인 경우 0 처리
      const amountInCents =
        !isNaN(amount) && amount !== null ? Math.round(amount * 100) : 0;

      return sum + amountInCents;
    }, 0);

    // 최종 결과 반환
    const todayTransferSum = parseFloat((resultSum / 100).toFixed(2));

    return {
      todayTransferSum,
      todayTransferCount: todayTransfers.length, // 필터링된 데이터 개수
    };
  }
}
