import { Controller, Patch, Post, Query, Request } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email Verification')
@ApiBearerAuth()
@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post()
  @ApiOperation({
    description: 'Issue email verification token for current user',
  })
  issueVerificationToken(@Request() req) {
    return this.emailVerificationService.issueVerificationToken({
      userId: req.user.id,
    });
  }

  @Post('/resend')
  @ApiOperation({
    description: 'Resend email verification token for current user',
  })
  resendVerificationToken(@Request() req) {
    return this.emailVerificationService.resendVerificationToken({
      userId: req.user.id,
    });
  }

  @Patch('/verify')
  @ApiOperation({ description: 'Verify user email' })
  verify(@Query('token') token: string, @Request() req) {
    return this.emailVerificationService.verifyEmail({
      userId: req.user.id,
      token,
    });
  }
}
