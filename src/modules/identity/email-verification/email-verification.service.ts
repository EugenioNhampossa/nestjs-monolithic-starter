import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TokenVerificationService } from '../token-verification/token-verification.service';
import { IssueEmailVerificationTokenDto, VerifyEmailDto } from './dto';
import { randomUUID } from 'node:crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATES,
  SEND_EMAIL_EVENT_TYPE,
  SendEmailEvent,
  VerificationEmailData,
} from 'src/common/events';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/config';
import { isTooSoon } from './helper';
import { DomainException } from 'src/common/http';
import { AppErrorCode } from 'src/common/enums';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly tokenVerificationService: TokenVerificationService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async issueVerificationToken(dto: IssueEmailVerificationTokenDto) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); //24h

    let email = dto.email;

    if (!email) {
      const user = await this.userService.findById(dto.userId);

      if (!user)
        throw new DomainException(
          AppErrorCode.USER_NOT_FOUND,
          'Could not found a user with this email.',
          HttpStatus.NOT_FOUND,
        );

      email = user.email;
    }

    await this.tokenVerificationService.create({
      expiresAt,
      token,
      identifier: dto.userId,
    });

    this.eventEmitter.emit(
      SEND_EMAIL_EVENT_TYPE,
      new SendEmailEvent<VerificationEmailData>(
        email,
        EMAIL_SUBJECTS.EMAIL_VRIFICATION,
        EMAIL_TEMPLATES.EMAIL_VRIFICATION,
        {
          confirmationUrl: `${this.configService.get(EnvVariables.client.webClientEmailVerificationUrl)}?token=${token}`,
        },
      ),
    );
  }

  async resendVerificationToken(dto: IssueEmailVerificationTokenDto) {
    const existingToken = await this.tokenVerificationService.findByIdentifier(
      dto.userId,
    );

    if (existingToken && isTooSoon(existingToken.createdAt)) {
      const secondsLeft =
        60 -
        Math.floor(
          (new Date().getTime() - existingToken.createdAt.getTime()) / 1000,
        );

      throw new DomainException(
        AppErrorCode.TOO_MANY_REQUESTS,
        `Too many requests. try again in ${secondsLeft} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.issueVerificationToken({ userId: dto.userId });
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const isValid = await this.tokenVerificationService.isTokenValid({
      identifier: dto.userId,
      token: dto.token,
    });

    if (!isValid)
      throw new DomainException(
        AppErrorCode.AUTH_INVALID_TOKEN,
        'Invalid token',
        HttpStatus.BAD_REQUEST,
      );

    await this.userService.verifyEmail(dto.userId);

    await this.tokenVerificationService.delete(dto.userId);
  }
}
