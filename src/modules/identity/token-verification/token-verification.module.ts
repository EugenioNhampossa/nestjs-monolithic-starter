import { Module } from '@nestjs/common';
import { TokenVerificationService } from './token-verification.service';
import { TokenVerificationRepository } from './token-verification.repository';

@Module({
  providers: [TokenVerificationService, TokenVerificationRepository],
  exports: [TokenVerificationService],
})
export class TokenVerificationModule {}
