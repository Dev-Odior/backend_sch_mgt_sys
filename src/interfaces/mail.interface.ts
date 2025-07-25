export interface MailOptionsAttributeI {
  to: string;
  from?: string;
  subject: string;
  templateName: string;
  replacements?: object;
}
