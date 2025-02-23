import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { TraceTemplate } from '../../core/template/trace.template';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { TRANSFER_TRACE } from './helper/trace.constant';
import { RequestQuoteDto } from './dtos/request.quote.dto';
import { TransferVO } from './vo/transfer.vo';
import { QuoteRepository } from './repositories/quote.repository';
import { QuoteDto } from './dtos/response.quote.dto';

@Injectable()
export class TransferService {
  constructor(
    private quoteRepository: QuoteRepository,
    private readonly traceTemplate: TraceTemplate,
  ) {}
  /**
   *  송금 견적서를 갖고 오는 기능
   * @param dto RequestQuoteDto
   * @returns user
   */
  @TraceExecution(TRANSFER_TRACE.CREATE_USER_SERVICE)
  async getTransferQuote(
    dto: RequestQuoteDto,
    userIdx: number,
  ): Promise<QuoteDto> {
    const exchangeRate = await this.getExchangeRate('KRW', dto.targetCurrency);
    const transferVO = new TransferVO(dto, exchangeRate);
    const quoteEntity = transferVO.toEntity(userIdx);
    const result = await this.quoteRepository.save(quoteEntity);
    return transferVO.getQuote(result.quoteId);
  }

  async getExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<number> {
    const result = await axios({
      method: 'GET',
      url: `${process.env.EXCHANGE_RATE_API_URL}/forex/recent?codes=,FRX.${baseCurrency + targetCurrency}`,
    });
    const exchangeRate = result.data[0].basePrice / result.data[0].currencyUnit;
    
    return exchangeRate;
  }
}
