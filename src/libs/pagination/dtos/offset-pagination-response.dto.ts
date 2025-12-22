import { ApiProperty } from '@nestjs/swagger';

export class OffsetPaginationResponseMeta {
  @ApiProperty({ example: true })
  isFirstPage: boolean;

  @ApiProperty({ example: false })
  isLastPage: boolean;

  @ApiProperty({ example: 3 })
  currentPage: number;

  @ApiProperty({ example: 2 })
  previousPage: number | null;

  @ApiProperty({ example: 4 })
  nextPage: number | null;

  @ApiProperty({ example: 5 })
  pageCount: number;

  @ApiProperty({ example: 40 })
  totalCount: number;
}

export class OffsetPaginationResponseDto<T> {
  @ApiProperty({ isArray: true })
  result: T[];

  @ApiProperty({ type: OffsetPaginationResponseMeta })
  meta: OffsetPaginationResponseMeta;
}
