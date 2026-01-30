import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IssueEmailVerificationTokenDto } from './issue-email-verification-token.dto';

export class VerifyEmailDto extends IssueEmailVerificationTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Token provided by email' })
  token: string;
}
