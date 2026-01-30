import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import { EnvVariables } from 'src/config';

@Injectable()
export class AuthCookiesConfig {
  private readonly cookiePath = '/api/auth/refresh';

  constructor(private readonly config: ConfigService) {}

  getRefreshConfiguration(): CookieOptions {
    const maxAgeInDays = parseInt(
      this.config.get(EnvVariables.jwt.refreshExpiresIn),
    );
    const isProduction = this.config.get(EnvVariables.env) === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: this.cookiePath,
      maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
    };
  }
}
