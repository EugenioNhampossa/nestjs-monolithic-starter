import { Injectable, Logger } from '@nestjs/common';
import {
  CustomPrismaClientFactory,
  loggingMiddleware,
  PrismaServiceOptions,
  QueryInfo,
} from 'nestjs-prisma';
import {
  type ExtendedPrismaClient,
  extendedPrismaClient,
} from '../database/prisma.extension';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './env.config';

@Injectable()
export class ExtendedPrismaConfigService
  implements CustomPrismaClientFactory<ExtendedPrismaClient>
{
  constructor(private readonly config: ConfigService) {}

  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        datasources: {
          db: { url: this.config.get(EnvVariables.database.url) },
        },
      },
      middlewares: [
        loggingMiddleware({
          logger: new Logger('PRISMA-MIDLEWARE'),
          logLevel: 'log',
          logMessage: (query: QueryInfo) =>
            `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
        }),
      ],
    };
  }

  createPrismaClient(): ExtendedPrismaClient {
    return extendedPrismaClient;
  }
}
