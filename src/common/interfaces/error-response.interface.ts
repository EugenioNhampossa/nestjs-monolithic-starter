import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class IErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  error: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp: string;
}
