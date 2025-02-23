import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { WinstonLoggerService } from '../logger/winston.logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {} // DI 사용
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse() as string | { message: string };
      const stack = exception.stack;

      // Logging the error
      try {
        const jsonString = JSON.stringify({
          timestamp: new Date().toISOString(),
          statusCode: status,
          message: typeof message === 'string' ? message : message.message,
          stack: stack,
        });
        this.logger.error(jsonString);
      } catch (error) {
        this.logger.error(error);
      }

      // Sending response to the client
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url,
        message,
      });
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';

      // Logging the error
      try {
        this.logger.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            statusCode: status,
            message,
          }),
        );
      } catch (error) {
        this.logger.error(error);
      }

      // Sending response to the client
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url,
        message,
      });
    }
  }
}
