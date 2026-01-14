import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ example: 1000, description: 'Amount in NGN' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'Wallet funding',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
