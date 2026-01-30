import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplateService } from '.';
import { EmailOptions } from '../interfaces';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { EnvVariables } from 'src/config';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const html = await this.templateService.renderTemplate(
        options.templatePath,
        options.templateData,
      );

      await this.mailService.sendMail({
        from: this.configService.get(EnvVariables.smtp.user),
        to: options.to,
        subject: options.subject,
        html,
        headers: {
          'X-Mailer': 'App Mail Service',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          Importance: 'High',
        },
      });

      this.logger.log(`Email sent successfully to: ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }
}
