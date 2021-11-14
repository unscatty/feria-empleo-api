import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import { stringToEnum } from 'src/shared/utils';
import { MailerCoreModuleOptions } from '../interfaces/mailer-core-module-options.interface';
import mailerModulesContainer from '../mailer-module-container';
import MailerStrategy from '../mailer-strategy';

export default registerAs(
  'mailerConfig',
  (): MailerCoreModuleOptions => ({
    strategy: stringToEnum(MailerStrategy, process.env[EnvConfig.USE_MAILER]),
    modules: mailerModulesContainer,
  })
);
