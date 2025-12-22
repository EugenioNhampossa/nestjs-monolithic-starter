import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { AuthService } from '../services';
import { EnvVariables } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(EnvVariables.jwt.secret),
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    const userId = payload.sub;
    return this.authService.validadeJwtUser(userId);
  }
}
