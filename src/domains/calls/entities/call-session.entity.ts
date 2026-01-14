import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { callStatus, callType } from '@/constants';
import { CallStatus, CallType } from '@/types';
import { User } from '../../users/entities/user.entity';

@Entity('call_sessions')
export class CallSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  callerId: string;

  @Column({ type: 'uuid' })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: callType,
    default: callType.Voice,
  })
  callType: CallType;

  @Column({
    type: 'enum',
    enum: callStatus,
    default: callStatus.Initiated,
  })
  status: CallStatus;

  @Column({ type: 'varchar', length: 255, unique: true })
  sessionId: string;

  @Column({ type: 'text', nullable: true })
  signalingData: string;

  @Column({ type: 'int', default: 0, comment: 'Duration in seconds' })
  duration: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Cost per minute',
  })
  ratePerMinute: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Total cost',
  })
  totalCost: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @ManyToOne(() => User, (user) => user.callsMade)
  @JoinColumn({ name: 'callerId' })
  caller: User;

  @ManyToOne(() => User, (user) => user.callsReceived)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
