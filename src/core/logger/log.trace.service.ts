import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { TraceId } from './trace.Id';
import { WinstonLoggerService } from './winston.logger.service';

interface TraceContext {
  traceId: TraceId;
  startTimeMs: number;
  message: string;
}

@Injectable()
export class LogTraceService {
  private static readonly START_PREFIX = '-->';
  private static readonly COMPLETE_PREFIX = '<--';
  private static readonly EX_PREFIX = '<X-';

  private asyncLocalStorage = new AsyncLocalStorage<TraceContext>();

  constructor(private readonly logger: WinstonLoggerService) {}

  begin(message: string): TraceContext {
    const store = this.asyncLocalStorage.getStore();

    let traceId: TraceId;
    if (store?.traceId) {
      traceId = store.traceId.createNextId(); // 기존 traceId에서 증가
    } else {
      traceId = new TraceId(); // 새 traceId 생성
    }

    // `TraceContext` 타입을 맞춰서 저장
    const traceContext: TraceContext = {
      traceId,
      startTimeMs: Date.now(),
      message,
    };

    this.asyncLocalStorage.enterWith(traceContext);

    this.logger.log(
      `[${traceId.getId()}] ${this.addSpace(LogTraceService.START_PREFIX, traceId.getLevel())} ${message}`,
    );

    return traceContext;
  }

  end(status: TraceContext): void {
    this.complete(status, null);
  }

  exception(status: TraceContext, error: Error): void {
    this.complete(status, error);
  }

  private complete(status: TraceContext, error: Error | null): void {
    const stopTimeMs = Date.now();
    const resultTimeMs = stopTimeMs - status.startTimeMs;
    const traceId = status.traceId;
    if (!error) {
      this.logger.log(
        `[${traceId.getId()}] ${this.addSpace(LogTraceService.COMPLETE_PREFIX, traceId.getLevel())} ${status.message} time=${resultTimeMs}ms`,
      );
    } else {
      this.logger.error(
        `[${traceId.getId()}] ${this.addSpace(LogTraceService.EX_PREFIX, traceId.getLevel())} ${status.message} time=${resultTimeMs}ms`,
        JSON.stringify(error),
      );
    }
  }

  private addSpace(prefix: string, level: number): string {
    return '|   '.repeat(level) + `|${prefix}`;
  }
}
