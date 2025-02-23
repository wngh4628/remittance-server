import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/middleware/exceptions.handler';
import { WinstonLoggerService } from './core/logger/winston.logger.service';

async function bootstrap() {
  console.log(
    `====================== API Start - ${process.env.NODE_ENV} !!======================`,
  );
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WinstonLoggerService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  await app.listen(process.env.PORT ?? 9006);
}
bootstrap();
