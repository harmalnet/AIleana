import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExampleDto {
  @ApiProperty({ example: 'Example Name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Example description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
