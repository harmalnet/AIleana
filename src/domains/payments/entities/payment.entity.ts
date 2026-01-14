import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { paymentStatus, paymentType } from '@/constants';
import { PaymentStatus, PaymentType } from '@/types';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  walletId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  transactionReference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'NGN' })
  currency: string;

  @Column({
    type: 'enum',
    enum: paymentStatus,
    default: paymentStatus.Pending,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: paymentType,
    default: paymentType.WalletFunding,
  })
  type: PaymentType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.payments)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
