import { createTransport } from 'nodemailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

import fs from 'fs';
import Handlebars from 'handlebars';
import Mail from 'nodemailer/lib/mailer';
import {
  MailOptionsAttributeI,
  ServerAlertOptionsAttributeI,
} from '../../interfaces/notification/mail.interface';

import { BadRequestError } from '@src/errors/indeex';
import { serverConfig } from '@src/configs';

class MailService {
  private transporter = createTransport({
    service: 'gmail',
    host: serverConfig.EMAIL_HOST,
    port: serverConfig.EMAIL_PORT,
    requireTLS: true,
    auth: {
      user: serverConfig.EMAIL_USER,
      pass: serverConfig.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    pool: true,
  } as SMTPPool.Options);

  public async sendMail(options: MailOptionsAttributeI) {
    const { to, from, subject, body, templateName, replacements, attachments, bcc, cc } = options;

    const mailData: Mail.Options = {
      from: `${from ? from : serverConfig.EMAIL_SENDER} <${serverConfig.EMAIL_SENDER}>`,
      to: to,
      subject: subject,
    };

    // DEBUG logs for tracking email properties
    serverConfig.DEBUG(`Mail Email Sender: ${serverConfig.EMAIL_SENDER}`);
    serverConfig.DEBUG(`Mail From: ${mailData.from}`);
    serverConfig.DEBUG(`Mail To: ${mailData.to}`);
    serverConfig.DEBUG(`Mail Template: ${templateName}`);
    if (cc) serverConfig.DEBUG(`Mail CC: ${cc}`);
    if (bcc) serverConfig.DEBUG(`Mail BCC: ${bcc}`);
    serverConfig.DEBUG(`Mail Subject: ${mailData.subject}`);

    if (templateName) {
      const filePath = `./src/resources/templates/${templateName}.html`;
      const source = fs.readFileSync(filePath, 'utf-8').toString();
      const template = Handlebars.compile(source);
      const html = template(replacements);

      mailData.html = html;
    } else if (body) {
      mailData.html = body;
    } else {
      throw new BadRequestError('Body or template is required.');
    }

    // Add optional parameters
    if (cc) mailData.cc = cc;
    if (bcc) mailData.bcc = bcc;
    if (attachments) mailData.attachments = attachments;

    return await this.sendMailWithRetry(mailData);
  }

  public async sendAlert(options: ServerAlertOptionsAttributeI) {
    const { service, error, req, dateTime } = options;

    const mailOptions: MailOptionsAttributeI = {
      to: serverConfig.EMAIL_SENDER,
      subject: 'Critical: Uncaught Error Alert',
      templateName: 'uncaughtErrorAlert',
      replacements: {
        service,
        errorMessage: error.message || 'No error message available',
        errorStack: error.stack || 'No stack trace available',
        timestamp: dateTime,
        requestUrl: req.originalUrl,
        requestMethod: req.method,
        requestHeaders: JSON.stringify(req.headers, null, 2),
        requestBody: JSON.stringify(req.body, null, 2) || 'No body',
        queryParams: JSON.stringify(req.params, null, 2) || 'No query params',
        userAgent: req.headers['user-agent'],
        userIp: req.ip,
      },
    };

    await this.sendMail(mailOptions);
  }

  private async sendMailWithRetry(
    mailData: Mail.Options,
    retries: number = 2,
  ): Promise<SMTPPool.SentMessageInfo> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailData, (error: Error | null, info: SMTPPool.SentMessageInfo) => {
        if (error) {
          if (retries > 0 && error.message.includes('Concurrent connections limit exceeded')) {
            setTimeout(() => {
              this.sendMailWithRetry(mailData, retries - 1)
                .then(resolve)
                .catch(reject);
            }, 2000); // Wait 2 seconds before retrying
          } else {
            serverConfig.DEBUG(`Error in sending mail: ${error}`);
            reject(error);
          }
        } else {
          serverConfig.DEBUG(`Email ${info.messageId} sent: ${info.response}`);
          resolve(info);
        }
      });
    });
  }
}

export default new MailService();
