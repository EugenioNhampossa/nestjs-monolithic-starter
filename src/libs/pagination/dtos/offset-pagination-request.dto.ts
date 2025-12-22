import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { OrderByRequestDto } from 'src/common/dtos/orderby-request.dto';

export class OffsetPaginationQuery extends OrderByRequestDto {
  @ApiProperty({ example: 2, required: false })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({ example: 20, required: false })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number | null;
}
