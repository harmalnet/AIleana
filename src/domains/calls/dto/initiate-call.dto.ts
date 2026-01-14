import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { callType } from '@/constants';
import { CallType } from '@/types';

export class InitiateCallDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID to call',
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    example: 'voice',
    enum: callType,
    default: callType.Voice,
  })
  @IsEnum(callType)
  @IsOptional()
  callType?: CallType;
}
