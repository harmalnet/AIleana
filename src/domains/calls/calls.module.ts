import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { PaymentsModule } from '../payments/payments.module';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallSession } from './entities/call-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallSession]),
    UsersModule,
    WalletsModule,
    PaymentsModule,
  ],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
