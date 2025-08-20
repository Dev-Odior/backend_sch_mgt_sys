/* eslint-disable @typescript-eslint/indent */
import { Request } from 'express';
import Mail from 'nodemailer/lib/mailer';

export interface MailOptionsAttributeI {
  to: string;
  from?: string;
  subject: string;
  body?: string;
  templateName?: string;
  replacements?: Record<string, any>;
  attachments?: Mail.Attachment[];
  cc?: string | string[];
  bcc?: string | string[];
}

export interface ServerAlertOptionsAttributeI {
  service: string;
  error: Error;
  req?: Pick<
    Request,
    'ip' | 'params' | 'body' | 'headers' | 'originalUrl' | 'method'
  >;
  dateTime?: string;
}
