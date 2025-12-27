import 'dotenv/config';
import 'dotenv-expand/config';

import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvVariables } from '../config';
import { Logger } from '@nestjs/common';

export const DEFAULT_PAGE_SIZE = 30;

const adapter = new PrismaPg({
  connectionString: process.env[EnvVariables.database.url] as string,
});

const prismaClient = new PrismaClient({ adapter });

const logger = new Logger('PRISMA_CLIENT');

export const extendedPrismaClient = prismaClient
  .$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = Math.ceil((end - start) * 100) / 100;
          logger.log(`Prisma Query ${model}.${operation} took ${time}ms`);
          return result;
        },
      },
    },
  })
  .$extends(
    pagination({
      pages: {
        limit: DEFAULT_PAGE_SIZE,
      },
      cursor: {
        limit: DEFAULT_PAGE_SIZE,
        getCursor({ id }) {
          return id;
        },
        parseCursor(cursor) {
          return {
            id: cursor,
          };
        },
      },
    }),
  );
  ;

export type ExtendedPrismaClient = typeof extendedPrismaClient;
