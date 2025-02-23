import { Global, Module } from '@nestjs/common';
import { LogTraceService } from './log.trace.service';
import { WinstonLoggerService } from './winston.logger.service';
import { TraceTemplate } from '../template/trace.template';

@Global()
@Module({
  providers: [WinstonLoggerService, LogTraceService, TraceTemplate],
  exports: [WinstonLoggerService, LogTraceService, TraceTemplate],
})
export class LoggerModule {}
