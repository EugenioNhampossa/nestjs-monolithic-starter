import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailSenderService } from '../services';
import { SEND_EMAIL_EVENT_TYPE, SendEmailEvent } from 'src/common/events';

@Injectable()
export class EmailEventHandler {
  private readonly logger = new Logger(EmailEventHandler.name);

  constructor(private readonly emailService: EmailSenderService) {}

  @OnEvent(SEND_EMAIL_EVENT_TYPE, { async: true })
  async handleSendEmail(payload: SendEmailEvent): Promise<void> {
    try {
      this.logger.log(`Processing email event for: ${payload.to}`);

      await this.emailService.sendEmail({
        to: payload.to,
        subject: payload.subject,
        templatePath: payload.templatePath,
        templateData: payload.templateData,
      });

      this.logger.log(`Email event processed successfully for: ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to process email event for ${payload.to}:`,
        error,
      );
    }
  }
}
