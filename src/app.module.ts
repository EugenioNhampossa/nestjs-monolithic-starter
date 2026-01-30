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
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from './modules/identity/auth/guards';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { EmailModule } from './modules/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { IdentityModule } from './modules/identity/identity.module';

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
          secure: false,
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
    EmailModule,
    IdentityModule,
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
  static webclient: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get(EnvVariables.api.port);
    AppModule.prefix = this.configService.get(EnvVariables.api.prefix);
    AppModule.webclient = this.configService.get(EnvVariables.client.web);
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
