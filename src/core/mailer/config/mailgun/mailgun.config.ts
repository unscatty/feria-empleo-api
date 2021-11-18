import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import { toMailgunMailData } from 'src/shared/utils/mailer/mailgun.util';
import { MailgunModuleOptions } from '../../modules/mailgun/implementation/mailgun.interfaces';
import { defaultMailData } from '../mailer-default.config';

const ENV = process.env;

export default registerAs(
  'mailgunConfig',
  (): MailgunModuleOptions => ({
    options: {
      key: ENV[EnvConfig.MAILGUN_API_KEY],
      username: ENV[EnvConfig.MAILGUN_USERNAME],
      domain: ENV[EnvConfig.MAILGUN_DOMAIN],
    },
    defaults: toMailgunMailData(defaultMailData()),
  })
);
