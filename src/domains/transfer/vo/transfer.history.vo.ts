import { PagenationVo } from '../../../core/base/pagenation.vo';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { TransferHistorysDto } from '../dtos/transfer.historys.dto';
import { User } from 'src/domains/user/entities/user.entity';
import { RequestTransferHistoryDto } from '../dtos/request.transfer.history.dto';

export class TransferHistoryVo extends PagenationVo {
  @Expose()
  resultCode: number;

  @Expose()
  resultMsg: string;

  @Expose()
  userId: string;

  @Expose()
  name: string;

  @Expose()
  todayTransferCount: number;

  @Expose()
  todayTransferUsdAmount: number;

  @Expose()
  @Type(() => TransferHistorysDto)
  history: TransferHistorysDto[];

  constructor(dto: RequestTransferHistoryDto, user: User) {
    
    super(dto);
    this.name = user.name;
    this.userId = user.userId;
  }
  toJson(todayTransferUsdAmount: number, todayTransferCount: number) {
      return {
        resultCode: this.resultCode,
        resultMsg: this.resultMsg,
        userId: this.userId,
        name: this.name,
        todayTransferCount: todayTransferCount,
        todayTransferUsdAmount: todayTransferUsdAmount,
        history: this.history,
      };
  }
}
