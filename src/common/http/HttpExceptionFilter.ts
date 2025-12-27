import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { IErrorResponse } from '../interfaces';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/client';

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

    const { httpStatus, message } = this.getErrorStatusAndMessage(exception);

    const errorResponse: IErrorResponse = {
      statusCode: httpStatus,
      message,
      error: HttpStatus[httpStatus],
      path: httpAdapter.getRequestUrl(request),
      timestamp: new Date().toISOString(),
    };

    this.logError(exception, request);

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }

  private getErrorStatusAndMessage(exception: unknown): {
    httpStatus: HttpStatus;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      return {
        httpStatus: exception.getStatus(),
        message: this.formatHttpExceptionMessage(exception.getResponse()),
      };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    if (exception instanceof PrismaClientValidationError) {
      this.logger.error('Prisma Validation Error:', (exception as Error).stack);
      return {
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Input data validation failed.',
      };
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      message: DEFAULT_ERROR_MESSAGE,
    };
  }

  private handlePrismaKnownError(exception: PrismaClientKnownRequestError): {
    httpStatus: HttpStatus;
    message: string[];
  } {
    switch (exception.code) {
      case 'P2002':
        return {
          httpStatus: HttpStatus.CONFLICT,
          message: [
            `The value provided for the field '${exception.meta?.target}' already exists.`,
            'Please use a different value.',
          ],
        };
      case 'P2003':
        return {
          httpStatus: HttpStatus.BAD_REQUEST,
          message: [
            `The reference for the field '${exception.meta?.field_name}' is not valid.`,
            'Please ensure the related record exists.',
          ],
        };
      case 'P2025':
        return {
          httpStatus: HttpStatus.NOT_FOUND,
          message: [
            'The record you are trying to operate on was not found.',
            (exception.meta?.cause as string) || 'Resource not found.',
          ],
        };
      default:
        return {
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [DEFAULT_ERROR_MESSAGE],
        };
    }
  }

  private formatHttpExceptionMessage(
    response: string | object,
  ): string | string[] {
    if (typeof response === 'string') {
      return [response];
    }
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
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorLog = {
      statusCode: status,
      method: request.method,
      url: request.url,
      stack: (exception as Error).stack,
    };

    if (status >= 500) {
      this.logger.error('Server Error:', errorLog);
    } else {
      this.logger.warn('Client Error:', errorLog);
    }
  }
}
