import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogTraceService } from '../logger/log.trace.service';
import { TraceMessage } from '../decorators/trace.decorator';

@Injectable()
export class TraceTemplate {
  constructor(private readonly logTraceService: LogTraceService) {}

  async execute<T>(
    traceMessage: TraceMessage,
    callback: () => Promise<T>,
  ): Promise<T> {
    const status = this.logTraceService.begin(traceMessage.message);

    try {
      const result = await callback();
      this.logTraceService.end(status);
      return result;
    } catch (error) {
      console.log('error: ', error);
      
      const errorMessage = error.code
        ? traceMessage.errorCodeMap[error.code]
        : error.response;
        
      this.logTraceService.exception(status, error);
      throw new InternalServerErrorException(
        errorMessage || traceMessage.errorMessage,
      );
    }
  }
}
