import { ValidationPipe } from '@nestjs/common';

const validationPipeOptions = new ValidationPipe({
  whitelist: true,
  enableDebugMessages: true,
  transform: true,
  forbidUnknownValues: true,
});

export { validationPipeOptions };
