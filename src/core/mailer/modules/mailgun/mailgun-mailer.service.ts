import { Injectable } from '@nestjs/common';
import { removeEmptyValues } from 'src/shared/utils';
import { toMailgunMailData } from 'src/shared/utils/mailer/mailgun.util';
import { Email, IMailerService } from '../../interfaces';
import { MailData } from './implementation/interfaces/mailgun-mail-data.interface';
import { MailgunService } from './implementation/mailgun.service';

@Injectable()
export default class MailgunMailerService implements IMailerService {
  constructor(private readonly mailgunService: MailgunService) {}

  async sendMail(email: Email): Promise<void> {
    await this.mailgunService.send(this.toMailData(email));
    return;
  }

  private toMailData(email: Email): MailData {
    const sgData = toMailgunMailData(email);
    return removeEmptyValues(sgData);
  }
}
