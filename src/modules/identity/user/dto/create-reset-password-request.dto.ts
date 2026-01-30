import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address of the user' })
  email: string;
}
