import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from './api-config/api-config.service';
import { AppLoggerService } from './logger/app-logger.service';
import { Log } from './logger/log.entity';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [ApiConfigService, AppLoggerService],
  exports: [ApiConfigService, TypeOrmModule, AppLoggerService],
})
export class ConfigsModule {}
