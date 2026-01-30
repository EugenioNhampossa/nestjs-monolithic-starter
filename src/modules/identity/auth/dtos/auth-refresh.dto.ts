import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty({ description: 'refresh token from the current user' })
  @IsString()
  @IsNotEmpty()
  refresh: string;
}
