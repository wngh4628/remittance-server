import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TargetCurrency, TransferStatus } from '../helper/constant';
import BaseEntity from '../../../core/typeorm/base.entity';
import { Quote } from './quote.entity';

@Entity('transfer')
export class Transfer extends BaseEntity {
  @Column({ type: 'int', name: 'quote_id', nullable: false })
  quoteId: number;

  @Column({ type: 'int', name: 'user_idx', nullable: false })
  userIdx: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'target_currency',
    nullable: false,
  })
  targetCurrency: TargetCurrency;

  @Column({
    type: 'enum',
    enum: ['INITIATED', 'COMPLETED', 'FAILED', 'PENDING'],
    default: 'PENDING',
  })
  status: TransferStatus;

  // Quote 엔티티와 1:1 관계 설정
  @OneToOne(() => Quote, (quote) => quote.transfer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' }) // 외래키 설정
  quote: Quote;
}
