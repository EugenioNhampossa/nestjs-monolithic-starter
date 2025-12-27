import 'dotenv/config';
import 'dotenv-expand/config';

import path from 'node:path';
import type { PrismaConfig } from 'prisma';
import { env } from 'prisma/config';

export default {
  schema: path.join('src', 'database', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: path.join('src', 'database', 'migrations'),
    seed: `ts-node src/database/seed.ts`,
  },
  views: {
    path: path.join('src', 'database', 'views'),
  },
  typedSql: {
    path: path.join('src', 'database', 'queries'),
  },
} satisfies PrismaConfig;
