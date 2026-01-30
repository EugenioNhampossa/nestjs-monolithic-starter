import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { AuthService } from '../services';
import { Request } from 'express';
import { EnvVariables } from 'src/config';
import { COOKIE_KEYS, Strategies } from '../constants';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  Strategies.refreshJwt,
) {
  constructor(
    private readonly consigService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies[COOKIE_KEYS.refreshToken];
      },
      secretOrKey: consigService.get(EnvVariables.jwt.refreshSecret),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.cookies?.[COOKIE_KEYS.refreshToken];
    return this.authService.validadeRefreshToken(userId, refreshToken);
  }
}
