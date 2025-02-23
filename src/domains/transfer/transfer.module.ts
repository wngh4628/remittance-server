import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../core/typeorm/typeorm.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { QuoteRepository } from './repositories/quote.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([QuoteRepository])],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService, TypeOrmExModule],
})
export class TransferModule {}
