import { forwardRef, Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { TokenVerificationModule } from '../token-verification/token-verification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenVerificationModule, forwardRef(() => UserModule)],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
