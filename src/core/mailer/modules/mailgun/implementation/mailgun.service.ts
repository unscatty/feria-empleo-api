import { Inject, Injectable } from '@nestjs/common';
import * as deepmerge from 'deepmerge';
import Client from 'mailgun.js/dist/lib/client';
import { MailData } from './interfaces/mailgun-mail-data.interface';
import { MailgunConstants } from './mailgun.constants';
import { MailgunModuleOptions } from './mailgun.interfaces';
import { mailgunLogger } from './mailgun.logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const formData = require('form-data');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mailgun = require('mailgun.js');

@Injectable()
export class MailgunService {
  private readonly mailgunClient: Client;

  constructor(
    @Inject(MailgunConstants.MAILGUN_MODULE_OPTIONS)
    private readonly options: MailgunModuleOptions
  ) {
    const mailgun = new Mailgun(formData);
    this.mailgunClient = mailgun.client(options.options);
    mailgunLogger.log('Set Mailgun client');
  }

  async send(data: MailData) {
    const mergedData = this.mergeWithDefaultMailData(data);
    return this.mailgunClient.messages.create(this.options.options.domain, mergedData);
  }

  private mergeWithDefaultMailData(data: MailData): MailData {
    if (!this.options.defaults) {
      return data;
    }

    return deepmerge(this.options.defaults, data, { clone: false });
  }
}
