import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class SignalDto {
  @ApiProperty({
    example: 'offer',
    description: 'Signal type: offer, answer, ice-candidate',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: { sdp: 'v=0\no=- ...' },
    description: 'Signal data (SDP or ICE candidate)',
  })
  @IsObject()
  @IsOptional()
  data?: any;
}
