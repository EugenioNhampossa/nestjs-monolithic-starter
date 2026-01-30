import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../auth/decorators';

@ApiTags('Password Reset')
@ApiBearerAuth()
@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Public()
  @Post('/request')
  @ApiOperation({ description: 'Request reset password for current user' })
  requestResetPassword(@Body() dto: RequestPasswordResetDto) {
    return this.passwordResetService.requestPasswordReset(dto);
  }

  @Public()
  @Patch('/complete')
  @ApiOperation({
    description: 'Complete reset password providing token and password',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto);
  }
}
