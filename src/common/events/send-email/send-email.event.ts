export class SendEmailEvent<T = Record<string, any>> {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly templatePath: string,
    public readonly templateData: T,
  ) {}
}
