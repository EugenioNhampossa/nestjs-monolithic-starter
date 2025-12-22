import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  GoogleStrategy,
  JwtStrategy,
  LocalStrategy,
  RefreshStrategy,
} from './strategies';
import { EnvVariables } from 'src/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get(EnvVariables.jwt.secret),
        signOptions: {
          expiresIn: config.get(EnvVariables.jwt.accessExpiresIn),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
