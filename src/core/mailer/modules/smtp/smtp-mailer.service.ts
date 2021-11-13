import {
  ISendMailOptions,
  MailerOptions,
  MailerService,
  MAILER_OPTIONS,
} from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
// deepmerge ESM entry point was dropped due to a Webpack bug. DO NOT REFACTOR
// https://github.com/webpack/webpack/issues/6584
import * as deepmerge from 'deepmerge';
import { removeEmptyValues, toAttachment } from 'src/shared/utils';
import { Email } from '../../interfaces/email.interfaces';
import { IMailerService } from '../../interfaces/mailer-service.interface';

@Injectable()
export default class SMTPMailerService implements IMailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(MAILER_OPTIONS) private readonly mailerOptions: MailerOptions
  ) {}

  async sendMail(email: Email): Promise<void> {
    const data = this.toMailData(email);

    const mergedWithDefault = this.mergeWithDefaultMailData(data);

    await this.mailerService.sendMail(mergedWithDefault);
  }

  private toMailData(email: Email): ISendMailOptions {
    const smtpAttachments = email.attachments?.map(toAttachment);

    const smtpData = { ...email, attachments: smtpAttachments };

    return removeEmptyValues(smtpData);
  }

  private mergeWithDefaultMailData(data: ISendMailOptions): ISendMailOptions {
    if (!this.mailerOptions.defaults) {
      return data;
    }

    return deepmerge(this.mailerOptions.defaults, data, { clone: false });
  }
}
