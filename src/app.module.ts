import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ValidationSchema,
  ExtendedPrismaConfigService,
  EnvVariables,
} from './config';
import { CustomPrismaModule } from 'nestjs-prisma';
import { ResilienceModule } from 'nestjs-resilience';
import { LoggerMiddleware } from './common/http';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { UserModule } from './modules/auth/user/user.module';
@Module({
  imports: [
    PrometheusModule.register(),
    EventEmitterModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get(EnvVariables.smtp.host),
          port: config.get(EnvVariables.smtp.port),
          auth: {
            user: config.get(EnvVariables.smtp.user),
            pass: config.get(EnvVariables.smtp.password),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: ValidationSchema,
    }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      isGlobal: true,
      useClass: ExtendedPrismaConfigService,
    }),
    ResilienceModule.forRoot({}),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  static port: number;
  static prefix: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get(EnvVariables.api.port);
    AppModule.prefix = this.configService.get(EnvVariables.api.prefix);
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
