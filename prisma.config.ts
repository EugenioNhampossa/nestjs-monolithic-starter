import 'dotenv/config';
import 'dotenv-expand/config';

import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  schema: path.join('src', 'database', 'schema.prisma'),
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
