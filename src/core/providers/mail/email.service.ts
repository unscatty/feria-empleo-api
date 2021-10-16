import { Injectable } from '@nestjs/common';
import * as sgMailer from '@sendgrid/mail';

import { Email } from './email';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

/**
 * @export
 * @class EmailService
 */
@Injectable()
export class EmailService {
  private mailOptions: MailOptions;

  /**
   *Creates an instance of EmailService.
   * @memberof EmailService
   */
  constructor() {
    sgMailer.setApiKey(process.env.SEND_GRID_API_KEY);
    this.mailOptions = { from: '', to: '', subject: '', html: '' };
  }

  /**
   * @param {Email} mail
   * @return {Promise<string>}
   * @memberof EmailService
   */
  public async sendEmail(mail: Email): Promise<void> {
    try {
      this.setMailOptions(mail);
      await sgMailer.send(this.mailOptions);
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   *
   * @private
   * @param {Email} mail
   * @memberof EmailService
   */
  private setMailOptions(mail: Email): void {
    this.mailOptions = {
      from: mail.from,
      to: mail.to,
      subject: mail.header,
      html: mail.message,
    };
  }
}
