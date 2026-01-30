import { Module } from '@nestjs/common';
import { EmailEventHandler } from './handlers';
import { TemplateService, EmailSenderService } from './services';

@Module({
  providers: [TemplateService, EmailSenderService, EmailEventHandler],
  exports: [EmailSenderService],
})
export class EmailModule {}
