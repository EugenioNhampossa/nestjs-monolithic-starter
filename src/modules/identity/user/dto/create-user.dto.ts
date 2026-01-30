import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Full name of the user' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password for the user account' })
  password: string;
}
