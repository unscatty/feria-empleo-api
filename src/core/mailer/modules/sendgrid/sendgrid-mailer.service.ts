import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { removeEmptyValues } from 'src/shared/utils/';
import toSendgridMailData from 'src/shared/utils/mailer/sendgrid.util';
import { Email } from '../../interfaces/email.interfaces';
import { IMailerService } from '../../interfaces/mailer-service.interface';
import { SendGridService } from './implementation/sendgrid.service';

@Injectable()
export default class SendgridMailerService implements IMailerService {
  constructor(private readonly sengridService: SendGridService) {}

  async sendMail(email: Email): Promise<void> {
    await this.sengridService.send(this.toMailData(email));
  }

  private toMailData(email: Email): MailDataRequired {
    const sendgridData = toSendgridMailData(email);

    return removeEmptyValues(sendgridData);
  }
}
