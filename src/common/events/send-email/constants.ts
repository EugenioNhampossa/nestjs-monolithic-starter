import { join } from 'path';

export const SEND_EMAIL_EVENT_TYPE = 'SendEmail';

const getTemplatePath = (templateName: string): string => {
  return join(
    process.cwd(),
    'dist',
    'src',
    'modules',
    'email',
    'templates',
    templateName,
  );
};

export const EMAIL_TEMPLATES = {
  RESET_PASSWORD: getTemplatePath('reset-password.ejs'),
  EMAIL_VRIFICATION: getTemplatePath('email-verification.ejs'),
};

export const EMAIL_SUBJECTS = {
  RESET_PASSWORD: 'Reset Your Password',
  EMAIL_VRIFICATION: 'Verify Your Email',
};
