import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import Options from 'mailgun.js/lib/interfaces/Options';
import { MailData } from './interfaces/mailgun-mail-data.interface';

export { default as Options } from 'mailgun.js/lib/interfaces/Options';

export interface MailgunOptions extends Options {
  domain: string;
}

export interface MailgunModuleOptions {
  options: MailgunOptions;

  defaults?: Partial<MailData>;
}

export type MailgunModuleAsyncOptions = {
  useFactory: (...args: any[]) => MailgunModuleOptions | Promise<MailgunModuleOptions>;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;
