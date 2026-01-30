import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IssueEmailVerificationTokenDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
