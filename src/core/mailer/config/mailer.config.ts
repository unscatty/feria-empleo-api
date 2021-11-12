import { registerAs } from '@nestjs/config';
import { MailerCoreModuleOptions } from '../interfaces/mailer-core-module-options.interface';
import MailerStrategy from '../mailer-strategy';
import mailerModulesContainer from '../mailer-module-container';

export const mailerCoreModuleOptions: MailerCoreModuleOptions = {
  strategy: MailerStrategy.SENDGRID,
  modules: mailerModulesContainer,
};

export default registerAs('mailerConfig', (): MailerCoreModuleOptions => mailerCoreModuleOptions);
