import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'valid token' })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'New Password' })
  newPassword: string;
}
