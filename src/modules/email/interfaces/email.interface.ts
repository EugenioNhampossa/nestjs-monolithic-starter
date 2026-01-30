export interface EmailOptions {
  to: string;
  subject: string;
  templatePath: string;
  templateData: Record<string, any>;
}
