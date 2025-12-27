import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from '../dtos';
import { EnvVariables } from 'src/config';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateToken(payload: JwtPayload, expiresIn): string {
    const token = this.jwtService.sign<JwtPayload>(payload, {
      expiresIn,
    });
    return token;
  }

  public async generateAuthToken(payload: JwtPayload): Promise<TokenDto> {
    const accessTokenExpires = this.configService.get(
      EnvVariables.jwt.accessExpiresIn,
    );
    const refreshTokenExpires = this.configService.get(
      EnvVariables.jwt.refreshExpiresIn,
    );
    const tokenType = this.configService.get(EnvVariables.jwt.tokenType);
    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      tokenType,
      accessToken,
      refreshToken,
      accessTokenExpires,
    };
  }
}
