import { Controller, Post, Body, Res } from '@nestjs/common';

import HttpResponse from '../../core/http/http-response';
import { REQUEST_SUCCESS_MESSAGE } from './helper/http.response.objects';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { TRANSFER_TRACE } from './helper/trace.constant';
import { TraceTemplate } from '../../core/template/trace.template';
import { TransferService } from './transfer.service';
import { RequestQuoteDto } from './dtos/request.quote.dto';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from 'src/core/decorators/user.auth.decorator';
import { User } from '../user/entities/user.entity';

@Controller('/transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly traceTemplate: TraceTemplate,
  ) {}
  @UseAuthGuards()
  @Post('quote')
  @TraceExecution(TRANSFER_TRACE.CREATE_USER_CONTROLLER)
  async getTransferQuote(
    @Res() res,
    @Body() dto: RequestQuoteDto,
    @AuthUser() user: User,
  ) {
    const result = await this.transferService.getTransferQuote(dto, user.idx);
    return HttpResponse.ok(res, result);
  }
}
