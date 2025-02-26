import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/middleware/exceptions.handler';
import { WinstonLoggerService } from './core/logger/winston.logger.service';
import { BadRequestExceptionFilter } from './core/middleware/badRequest.exceptions.handler';


async function bootstrap() {
  console.log(
    `====================== API Start - ${process.env.NODE_ENV} !!======================`,
  );
  console.log(
    `====================== API Start - ${process.env.PORT} !!======================`,
  );
  initializeTransactionalContext(); 
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalFilters(new BadRequestExceptionFilter(logger));

  await app.listen(process.env.PORT ?? 9006);
}
bootstrap();
