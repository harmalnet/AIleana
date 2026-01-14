import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class FundWalletDto {
  @ApiProperty({ example: 1000, description: 'Amount to fund in NGN' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
