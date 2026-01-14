import { Module } from '@nestjs/common';

import { EntityExistsValidator } from './mysql/entity-exists.validator';

@Module({
  providers: [EntityExistsValidator],
  exports: [EntityExistsValidator],
})
export class ValidatorsModule {}
