import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import Email from '../../interfaces/mailer-data.interface';
import { IMailerService } from '../../interfaces/mailer.service.interface';
import { SendGridService } from './implementation/sendgrid.service';

@Injectable()
export default class SendgridMailerService implements IMailerService {
  constructor(private readonly sengridService: SendGridService) {}

  async sendMail(data: Email): Promise<void> {
    await this.sengridService.send(data as MailDataRequired);
  }
}
