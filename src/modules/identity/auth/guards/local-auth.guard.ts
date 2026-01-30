import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from 'src/common/http';
import { AppErrorCode } from 'src/common/enums';
import { Strategies } from '../constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Strategies.local) {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;

    if (!email || !password) {
      throw new DomainException(
        AppErrorCode.AUTH_INVALID_CREDENTIALS,
        'Email and password must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return super.canActivate(context);
  }
}
