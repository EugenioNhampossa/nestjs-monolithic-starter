import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/decorators';

@Controller()
export class AppController {
  @Get('/')
  @Public()
  home() {
    return {
      app: 'rest-api',
      status: 'OK',
      message: 'Service is fully operational',
      timestamp: new Date().toISOString(),
    };
  }
}
