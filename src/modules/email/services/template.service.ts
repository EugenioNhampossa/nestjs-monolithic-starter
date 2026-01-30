import { HttpStatus, Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import { AppErrorCode } from 'src/common/enums';
import { DomainException } from 'src/common/http';

@Injectable()
export class TemplateService {
  async renderTemplate(
    templatePath: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      return ejs.render(template, data);
    } catch (error) {
      throw new DomainException(
        AppErrorCode.INTERNAL_SERVER_ERROR,
        `Failed to render template: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
