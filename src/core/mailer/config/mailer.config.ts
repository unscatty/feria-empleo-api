import { registerAs } from '@nestjs/config';
import { MailerCoreModuleOptions } from '../interfaces/mailer-core-module-options.interface';
import mailerModulesContainer from '../mailer-module-container';
import MailerStrategy from '../mailer-strategy';

export const mailerCoreModuleOptions: MailerCoreModuleOptions = {
  strategy: MailerStrategy.SENDGRID,
  modules: mailerModulesContainer,
};

export default registerAs('mailerConfig', (): MailerCoreModuleOptions => mailerCoreModuleOptions);
