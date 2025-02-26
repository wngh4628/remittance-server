import { Controller, Post, Body, Res, Get } from '@nestjs/common';

import HttpResponse from '../../core/http/http-response';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { TRANSFER_TRACE } from './helper/trace.constant';
import { TraceTemplate } from '../../core/template/trace.template';
import { TransferService } from './transfer.service';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from '../../core/decorators/user.auth.decorator';
import { User } from '../user/entities/user.entity';
import { CreateQuoteDto } from './dtos/\bcreate.quote.dto';
import { RequestQuoteDto } from './dtos/request.quote.dto';
import { REQUEST_SUCCESS_MESSAGE } from './helper/http.response.objects';
import { RequestTransferHistoryDto } from './dtos/request.transfer.history.dto';

@Controller('/transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly traceTemplate: TraceTemplate,
  ) {}

  @UseAuthGuards()
  @Post('/quote')
  @TraceExecution(TRANSFER_TRACE.GET_TRANSFER_QUOTE_CONTROLLER)
  async getTransferQuote(
    @Res() res,
    @Body() dto: CreateQuoteDto,
    @AuthUser() user: User,
  ) {
    const result = await this.transferService.getTransferQuote(dto, user.idx);
    // 해당 부분만 리턴 타입이 달라서 컨밴션 적용 못했습니다.
    return res.status(200).json({
      resultCode: 200,
      resultMsg: 'OK',
      quote: result,
    });
  }

  @UseAuthGuards()
  @Post('/request')
  @TraceExecution(TRANSFER_TRACE.REQUEST_TRANSFER_QUOTE_CONTROLLER)
  async requestTransferQuote(
    @Res() res,
    @Body() dto: RequestQuoteDto,
    @AuthUser() user: User,
  ) {
    const result = await this.transferService.requestTransferQuote(
      dto.quoteId,
      user.idx,
      user.idType,
    );
    if (result) {
      return HttpResponse.ok(
        res,
        REQUEST_SUCCESS_MESSAGE.REQUEST_TRANSFER_SUCCESS,
      );
    }
  }

  @UseAuthGuards()
  @Get('/list')
  @TraceExecution(TRANSFER_TRACE.GET_USER_TRANSCTION_HISTORY_CONTROLLER)
  async getUserTransactionHistory(
    @Res() res,
    @Body() dto: RequestTransferHistoryDto,
    @AuthUser() user: User,
  ) {
    const result = await this.transferService.getUserTransactionHistory(
      dto,
      user,
    );
    return HttpResponse.ok(res, result);
  }
}
