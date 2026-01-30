import { HttpStatus } from '@nestjs/common';
import { AppErrorCode } from 'src/common/enums';

export class DomainException extends Error {
  public readonly code: AppErrorCode;
  public readonly status: HttpStatus;
  public readonly messages: string[];

  constructor(
    code: AppErrorCode,
    message: string | string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const messageArray = Array.isArray(message) ? message : [message];
    super(messageArray[0]);

    this.code = code;
    this.status = status;
    this.messages = messageArray;
    this.name = 'DomainException';

    Error.captureStackTrace(this, this.constructor);
  }
}
