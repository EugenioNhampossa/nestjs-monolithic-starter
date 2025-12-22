export class SendEmailEvent {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly templatePath: string,
    public readonly templateData: Record<string, any>,
  ) {}
}
