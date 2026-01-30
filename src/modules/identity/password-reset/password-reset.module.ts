import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { UserModule } from '../user/user.module';
import { TokenVerificationModule } from '../token-verification/token-verification.module';

@Module({
  imports: [UserModule, TokenVerificationModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule {}
