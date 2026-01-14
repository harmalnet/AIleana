import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigService } from './configs/api-config/api-config.service';
import { ConfigsModule } from './configs/configs.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { WalletsModule } from './domains/wallets/wallets.module';
import { PaymentsModule } from './domains/payments/payments.module';
import { CallsModule } from './domains/calls/calls.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => config.throttleConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigsModule,
    DatabaseModule,
    HealthModule,
    // AIleana Domain modules
    AuthModule,
    UsersModule,
    WalletsModule,
    PaymentsModule,
    CallsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
