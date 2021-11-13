import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import {
  removeEmptyValues,
  toAttachmentData,
  toEmailData,
  toSendgridHeaders,
  toSingleEmailData,
} from 'src/shared/utils/';
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
    const { to, cc, bcc, from, replyTo, date, attachments, headers } = email;

    const sgFrom = toSingleEmailData(from);
    const sgReplyTo = toSingleEmailData(replyTo);

    const sgTo = toEmailData(to);
    const sgCC = toEmailData(cc);
    const sgBCC = toEmailData(bcc);

    const sgAttachments = attachments?.map(toAttachmentData);
    const sgHeaders = toSendgridHeaders(headers);

    const sgData = {
      from: sgFrom,
      subject: email.subject,
      to: sgTo,
      cc: sgCC,
      bcc: sgBCC,
      replyTo: sgReplyTo,
      text: email.text?.toString(),
      html: email.html?.toString(),
      attachments: sgAttachments,
      sendAt: date?.getTime(),
      headers: sgHeaders,
    };

    return removeEmptyValues(sgData);
  }
}
