import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;
}
