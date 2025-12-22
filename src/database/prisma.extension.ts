import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

export const DEFAULT_PAGE_SIZE = 30;

export const extendedPrismaClient = new PrismaClient().$extends(
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

export type ExtendedPrismaClient = typeof extendedPrismaClient;
