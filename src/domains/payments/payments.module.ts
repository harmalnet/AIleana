import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletsModule } from '../wallets/wallets.module';
import { Payment } from './entities/payment.entity';
import { MonnifyService } from './monnify.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => WalletsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MonnifyService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
