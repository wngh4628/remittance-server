import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TargetCurrency, TransferStatus } from '../helper/constant';
import { Transfer } from './transfer.entity';

@Entity('quote')
export class Quote {
  @PrimaryGeneratedColumn({
    comment: '인덱스',
    unsigned: true,
    type: 'integer',
  })
  quoteId: number;

  @Column({ type: 'int' })
  userIdx: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  sourceAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  usdExchangeRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  fee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  usdAmount: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'target_currency',
    nullable: false,
  })
  targetCurrency: TargetCurrency;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  exchangeRate: number;

  @Column({
    type: 'enum',
    enum: ['INITIATED', 'COMPLETED', 'FAILED', 'PENDING'],
    default: 'PENDING',
  })
  status: TransferStatus;

  @Column({ type: 'timestamp' })
  expireTime: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @CreateDateColumn()
  requestedDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date | null;

   // Transfer 엔티티와 1:1 관계 설정
   @OneToOne(() => Transfer, (transfer) => transfer.quote, { cascade: true })
   transfer: Transfer;

}
