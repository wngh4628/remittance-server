import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TargetCurrency } from '../helper/constant';

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
  amount: number;

  @Column({ type: 'varchar' })
  targetCurrency: TargetCurrency;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  exchangeRate: number;

  @Column({ type: 'timestamp' })
  expireTime: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date | null;
}
