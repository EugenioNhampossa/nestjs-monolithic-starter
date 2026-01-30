import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenVerificationService } from '../token-verification/token-verification.service';
import { UserService } from '../user/user.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SEND_EMAIL_EVENT_TYPE,
  SendEmailEvent,
  PassworResetEmailData,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
} from 'src/common/events';
import { EnvVariables } from 'src/config';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AppErrorCode } from 'src/common/enums';
import { DomainException } from 'src/common/http';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly tokenService: TokenVerificationService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const user = await this.userService.findByEmail(dto.email);

    if (!user) return;

    await this.tokenService.create({ token, expiresAt, identifier: dto.email });

    this.eventEmitter.emit(
      SEND_EMAIL_EVENT_TYPE,
      new SendEmailEvent<PassworResetEmailData>(
        user.email,
        EMAIL_SUBJECTS.RESET_PASSWORD,
        EMAIL_TEMPLATES.RESET_PASSWORD,
        {
          resetUrl: `${this.configService.get(EnvVariables.client.webClientResetPasswordUrl)}?token=${token}`,
        },
      ),
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { identifier } = await this.tokenService.findByToken(dto.token);

    const isValid = await this.tokenService.isTokenValid({
      identifier,
      token: dto.token,
    });

    if (!isValid)
      throw new DomainException(
        AppErrorCode.AUTH_INVALID_TOKEN,
        'Invalid token',
        HttpStatus.BAD_REQUEST,
      );

    await this.userService.resetPassword(identifier, dto.newPassword);

    await this.tokenService.delete(identifier);
  }
}
