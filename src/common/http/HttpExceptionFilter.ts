import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { IErrorResponse } from '../interfaces';
import { DomainException } from '.';
import { AppErrorCode } from '../enums';

const DEFAULT_ERROR_MESSAGE =
  'An unexpected server error occurred. Please try again later.';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP_EXCEPTION_FILTER');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const { httpStatus, message, errorCode } = this.getErrorDetails(exception);

    const errorResponse: IErrorResponse = {
      statusCode: httpStatus,
      message,
      errorCode,
      error: HttpStatus[httpStatus],
      path: httpAdapter.getRequestUrl(request),
      timestamp: new Date().toISOString(),
    };

    this.logError(exception, request);

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }

  private getErrorDetails(exception: unknown): {
    httpStatus: HttpStatus;
    message: string | string[];
    errorCode?: AppErrorCode;
  } {
    if (exception instanceof DomainException) {
      return {
        httpStatus: exception.status,
        message: [exception.message],
        errorCode: exception.code,
      };
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      return {
        httpStatus: status,
        message: this.formatHttpExceptionMessage(response),
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Input data validation failed at the database level.',
        errorCode: AppErrorCode.VALIDATION_ERROR,
      };
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      message: DEFAULT_ERROR_MESSAGE,
      errorCode: AppErrorCode.INTERNAL_SERVER_ERROR,
    };
  }

  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): {
    httpStatus: HttpStatus;
    message: string[];
    errorCode: AppErrorCode;
  } {
    switch (exception.code) {
      case 'P2002':
        return {
          httpStatus: HttpStatus.CONFLICT,
          message: [
            `The value for field '${exception.meta?.target}' is already in use.`,
          ],
          errorCode: AppErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
        };
      case 'P2025':
        return {
          httpStatus: HttpStatus.NOT_FOUND,
          message: ['The requested record was not found.'],
          errorCode: AppErrorCode.DB_RECORD_NOT_FOUND,
        };
      default:
        return {
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [DEFAULT_ERROR_MESSAGE],
          errorCode: AppErrorCode.INTERNAL_SERVER_ERROR,
        };
    }
  }

  private formatHttpExceptionMessage(
    response: string | object,
  ): string | string[] {
    if (typeof response === 'string') return [response];
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      return Array.isArray(response.message)
        ? response.message
        : [response.message as string];
    }
    return [DEFAULT_ERROR_MESSAGE];
  }

  private logError(exception: unknown, request: any): void {
    let status: HttpStatus;
    let message: string | string[] | undefined;

    if (exception instanceof DomainException) {
      status = exception.status;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = this.formatHttpExceptionMessage(response);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (exception as Error).message;
    }

    const errorLog: any = {
      statusCode: status,
      method: request.method,
      url: request.url,
      message,
    };

    if (status >= 500) {
      errorLog.stack = (exception as Error).stack;
      this.logger.error(errorLog);
    } else {
      this.logger.warn(errorLog);
    }
  }
}
