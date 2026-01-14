import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

export class MonnifyWebhookDto {
  @ApiProperty({ example: 'MNY|20231214120000|000001' })
  @IsString()
  transactionReference: string;

  @ApiProperty({ example: 'PAY|20231214120000|000001' })
  @IsString()
  paymentReference: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  totalPayable: number;

  @ApiProperty({ example: 'PAID' })
  @IsString()
  paymentStatus: string;

  @ApiProperty({ example: '2023-12-14 12:00:00' })
  @IsString()
  @IsOptional()
  paidOn?: string;

  @ApiProperty({ example: 'ACCOUNT_TRANSFER' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: any;
}
