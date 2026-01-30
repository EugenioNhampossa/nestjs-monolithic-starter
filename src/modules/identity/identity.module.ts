import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenVerificationModule } from './token-verification/token-verification.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TokenVerificationModule,
    EmailVerificationModule,
    PasswordResetModule,
  ],
})
export class IdentityModule {}
