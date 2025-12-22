import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OrderByRequestDto {
  @ApiProperty({ example: 'name:asc', required: false })
  @IsString()
  @IsOptional()
  orderBy?: string;
}
