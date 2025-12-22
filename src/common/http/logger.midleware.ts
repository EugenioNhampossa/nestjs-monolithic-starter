'use strict';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();

    const {
      ip,
      method,
      originalUrl,
      query,
      body,
      headers: { authorization, connection, origin },
    } = request;
    this.logger.verbose(
      `Incoming Request: ${method} ${originalUrl} - IP: ${ip} - Query: ${JSON.stringify(query)} - Headers: {authorization: ${authorization}, connection: ${connection}, origin: ${origin}} - Body: ${JSON.stringify(body)}`,
    );

    const oldWrite = response.write;
    const oldEnd = response.end;

    const chunks: any[] = [];

    response.write = (...args: any): boolean => {
      chunks.push(Buffer.from(args[0]));
      return oldWrite.apply(response, args);
    };

    response.end = (...args: any): Response => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      const result = oldEnd.apply(response, args);

      const { statusCode } = response;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      this.logger.verbose(
        `Outgoing Response: ${method} ${originalUrl} - Status: ${statusCode} - Response Time: ${responseTime.toFixed(3)}ms - IP: ${ip}`,
      );

      return result;
    };

    next();
  }
}
