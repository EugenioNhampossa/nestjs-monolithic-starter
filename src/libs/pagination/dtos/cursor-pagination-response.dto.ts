import { ApiProperty } from '@nestjs/swagger';

export class CursorPaginationResponseMeta {
  @ApiProperty({ example: true })
  hasPreviousPage: boolean;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: '01K2ZB8T8WAX3Y3HVEGAXJN23X' })
  startCursor: string | null;

  @ApiProperty({ example: '01K2ZB8T8WAX3Y3HVEGAXJN23X' })
  endCursor: string | null;
}

export class CursorPaginationResponseDto<T> {
  @ApiProperty({ isArray: true })
  result: T[];

  @ApiProperty({ type: CursorPaginationResponseMeta })
  meta: CursorPaginationResponseMeta;
}
