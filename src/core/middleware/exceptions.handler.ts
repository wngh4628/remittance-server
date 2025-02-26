import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WinstonLoggerService } from '../logger/winston.logger.service';
import { HttpErrorFormat } from '../http/http-error-objects';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let httpError: HttpErrorFormat;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        httpError = {
          errorCode: 'UNKNOWN',
          resultMsg: exceptionResponse,
        };
      } else {
        httpError = exceptionResponse as HttpErrorFormat;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      httpError = {
        errorCode: 'INTERNAL_SERVER_ERROR',
        resultMsg: 'Internal server error',
      };
    }

    // 로깅 처리
    const logPayload = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: httpError,
      stack: exception instanceof Error ? exception.stack : null,
    };

    try {
      this.logger.error(JSON.stringify(logPayload));
    } catch (logError) {
      console.error(logError);
    }

    // 클라이언트에 반환할 에러 응답 구성
    const errorResponse: Record<string, any> = {
      resultCode: status,
      resultMsg: httpError.resultMsg,
    };

    if (httpError.description) {
      errorResponse.description = httpError.description;
    }
    response.status(status).json(errorResponse);
  }
}
