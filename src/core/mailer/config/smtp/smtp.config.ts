import { MailerOptions as NodeMailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import { mailerDefaultFrom } from '../defaults.config';

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
    defaults: {
      from: mailerDefaultFrom,
    },
  })
);
