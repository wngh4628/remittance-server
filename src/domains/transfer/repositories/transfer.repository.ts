import { Repository, Between, SelectQueryBuilder } from 'typeorm';

import { CustomRepository } from '../../../core/decorators/typeorm.decorator';
import { Transfer } from '../entities/transfer.entity';
import { TraceExecution } from '../../../core/decorators/trace.decorator';
import { TRANSFER_TRACE } from '../helper/trace.constant';
import { TransferStatusAllowed } from '../helper/constant';
import { TransferHistoryVo } from '../vo/transfer.history.vo';
import { plainToInstance } from 'class-transformer';
import { TransferHistorysDto } from '../dtos/transfer.historys.dto';

@CustomRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {
  @TraceExecution(TRANSFER_TRACE.TODAY_USER_TRANSFER_HISTORY)
  async todayUserTransferHistory(userIdx: number): Promise<Transfer[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 00:00:00
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 내일 00:00:00

    const result = await this.find({
      where: {
        userIdx,
        createdAt: Between(today, tomorrow),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return result;
  }

  @TraceExecution(TRANSFER_TRACE.GET_USER_TRANSCTION_HISTORY_REPOSITORY)
  async getUserTransactionHistory(
    vo: TransferHistoryVo,
    userIdx: number,
  ): Promise<TransferHistorysDto[]> {
    const queryBuilder: SelectQueryBuilder<Transfer> = this.createQueryBuilder(
      'transfer',
    )
      .select([
        'quote.sourceAmount AS sourceAmount',
        'quote.fee AS fee',
        'quote.usdExchangeRate AS usdExchangeRate',
        'quote.usdAmount AS usdAmount',
        'quote.targetCurrency AS targetCurrency',
        'quote.exchangeRate AS exchangeRate',
        'quote.targetAmount AS targetAmount',
        'quote.requestedDate AS requestedDate',
      ])
      .leftJoinAndSelect('transfer.quote', 'quote')
      .where('transfer.user_idx = :user_idx', { user_idx: userIdx })
      .andWhere('transfer.status = :status', { status: TransferStatusAllowed.COMPLETED })
      .orderBy('transfer.created_at', 'ASC');

    // 항후 페이징 추가를 위한 조건문
    if (vo.isPaging) {
      queryBuilder.skip(vo.offset).take(vo.limit).orderBy('transfer.created_at', vo.order);
    }
    

    const rawResult = await queryBuilder.getRawMany();
    
    //데이터 매핑
    const result = plainToInstance(TransferHistorysDto, rawResult, {
      excludeExtraneousValues: true,
    });
    
    return result;
  }
}
