import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DomainException } from '.';
import { AppErrorCode } from '../enums';

export class PrismaErrorFactory {
  static handle(error: unknown, modelName: Prisma.ModelName): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          this.handleUniqueConstraint(error, modelName);

        case 'P2003':
          this.handleForeignKeyConstraint(error, modelName);

        case 'P2025':
          throw new DomainException(
            this.getNotFoundCode(modelName),
            `${modelName} record not found for the requested operation.`,
            HttpStatus.NOT_FOUND,
          );
      }
    }

    throw new DomainException(
      AppErrorCode.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred while processing infrastructure data.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private static handleUniqueConstraint(
    error: Prisma.PrismaClientKnownRequestError,
    model: Prisma.ModelName,
  ): never {
    const target = (error.meta?.target as string[]) || [];

    if (model === Prisma.ModelName.User && target.includes('email')) {
      throw new DomainException(
        AppErrorCode.USER_EMAIL_ALREADY_EXISTS,
        'This email address is already registered.',
        HttpStatus.CONFLICT,
      );
    }

    throw new DomainException(
      AppErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
      `Duplicate data conflict on field(s): ${target.join(', ')}`,
      HttpStatus.CONFLICT,
    );
  }

  private static handleForeignKeyConstraint(
    error: Prisma.PrismaClientKnownRequestError,
    model: Prisma.ModelName,
  ): never {
    throw new DomainException(
      AppErrorCode.DB_FOREIGN_KEY_VIOLATION,
      `Invalid reference: One or more provided IDs for ${model} do not exist.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  private static getNotFoundCode(model: Prisma.ModelName): AppErrorCode {
    const mapping: Partial<Record<Prisma.ModelName, AppErrorCode>> = {
      [Prisma.ModelName.User]: AppErrorCode.USER_NOT_FOUND,
    };

    return mapping[model] || AppErrorCode.DB_RECORD_NOT_FOUND;
  }
}
