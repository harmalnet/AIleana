import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { callStatus } from '@/constants';
import { CallStatus } from '@/types';

export class UpdateCallStatusDto {
  @ApiProperty({
    example: 'ongoing',
    enum: callStatus,
  })
  @IsEnum(callStatus)
  status: CallStatus;
}
