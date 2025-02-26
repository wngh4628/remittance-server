import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../core/typeorm/typeorm.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { QuoteRepository } from './repositories/quote.repository';
import { TransferRepository } from './repositories/transfer.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([
    QuoteRepository,
    TransferRepository,
  ])],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [TransferService, TypeOrmExModule],
})
export class TransferModule {}
