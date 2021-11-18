import { MailerOptions as NodeMailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import toSMTPMailData from 'src/shared/utils/mailer/smtp.util';
import { defaultMailData } from '../mailer-default.config';

const ENV = process.env;

export default registerAs(
  'smtpConfig',
  (): NodeMailerOptions => ({
    transport: {
      host: ENV[EnvConfig.EMAIL_SERVER],
      port: parseInt(ENV[EnvConfig.EMAIL_PORT], 10),
      secure: false,
      authMethod: 'plain',
      requireTLS: true,
      auth: {
        user: ENV['EMAIL_USER'],
        pass: ENV[EnvConfig.EMAIL_PASSWORD],
      },
    },
    defaults: toSMTPMailData(defaultMailData()),
  })
);
