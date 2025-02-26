import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { WinstonLoggerService } from '../logger/winston.logger.service';
import { HttpErrorConstants } from '../http/http-error-objects';

interface HttpErrorFormat {
  errorCode: string;
  resultMsg: string;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    console.log('exceptionResponse: ', exceptionResponse);

    // 기본 메시지를 설정하는 로직 추가
    let resultMsg;

    const message = (exceptionResponse as any).message;
    if (Array.isArray(message) && message.length > 0) {
      resultMsg = message[0].includes(HttpErrorConstants.NOT_BE_EMPTY)
        ? HttpErrorConstants.ERR_INVALID_PARAMS
        : message[0]; // 첫 번째 에러 메시지만 사용
    } else if (typeof message === 'string') {
      resultMsg = message;
    }

    const errorResponse: HttpErrorFormat = {
      errorCode: 'ERR_INVALID_PARAMS',
      resultMsg: resultMsg,
    };

    // 로깅 처리
    const logPayload = {
      errorCode: 'ERR_INVALID_PARAMS',
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: errorResponse,
      stack: exception instanceof Error ? exception.stack : null,
    };

    try {
      this.logger.error(JSON.stringify(logPayload));
    } catch (logError) {
      console.error(logError);
    }

    response.status(status).json({
      resultCode: HttpStatus.BAD_REQUEST,
      resultMsg: resultMsg,
    });
  }
}
