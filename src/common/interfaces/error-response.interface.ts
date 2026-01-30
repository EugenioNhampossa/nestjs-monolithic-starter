import { ApiProperty } from '@nestjs/swagger';
import { AppErrorCode } from '../enums';

export class IErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  error: string;

  @ApiProperty({ required: false, enum: AppErrorCode })
  errorCode?: AppErrorCode;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp: string;
}
