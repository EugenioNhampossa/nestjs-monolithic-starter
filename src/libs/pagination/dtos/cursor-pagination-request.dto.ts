import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { OrderByRequestDto } from 'src/common/dtos/orderby-request.dto';

export class CursorPaginationQuery extends OrderByRequestDto {
  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number | null;

  @ApiProperty({ example: '01K2ZC2VPYCPNX22YAFHEGRDPN', required: false })
  @IsOptional()
  after?: string;
}
