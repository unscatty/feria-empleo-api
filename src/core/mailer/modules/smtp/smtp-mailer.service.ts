import {
  ISendMailOptions,
  MailerOptions,
  MailerService,
  MAILER_OPTIONS,
} from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
// deepmerge ESM entry point was dropped due to a Webpack bug. DO NOT REFACTOR
// https://github.com/webpack/webpack/issues/6584
// eslint-disable-next-line @typescript-eslint/no-var-requires
const deepmerge = require('deepmerge');
import { IMailerData } from '../../interfaces/mailer-data.interface';
import { IMailerService } from '../../interfaces/mailer.service.interface';

@Injectable()
export default class SMTPMailerService implements IMailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(MAILER_OPTIONS) private readonly mailerOptions: MailerOptions
  ) {}

  async sendMail(data: IMailerData): Promise<void> {
    const _data = data as ISendMailOptions;

    const mailData: ISendMailOptions = this.mailerOptions.defaults
      ? deepmerge(this.mailerOptions.defaults, _data)
      : _data;

    await this.mailerService.sendMail(mailData);
  }
}
