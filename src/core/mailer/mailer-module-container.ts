import { ConfigModule, ConfigType } from '@nestjs/config';
import sendgridConfig from './config/sendgrid/sendgrid.config';
import smtpConfig from './config/smtp/smtp.config';
import MailerModuleContainer from './interfaces/mailer-module-container.interface';
import MailerStrategy from './mailer-strategy';
import { SendGridMailerModule } from './modules/sendgrid/sendgrid-mailer.module';
import { SMTPMailerModule } from './modules/smtp/smtp-mailer.module';

const mailerModulesContainer: MailerModuleContainer = {
  [MailerStrategy.SMTP]: () => {
    return SMTPMailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(smtpConfig)],
      useFactory: (config: ConfigType<typeof smtpConfig>) => config,
      inject: [smtpConfig.KEY],
    });
  },

  [MailerStrategy.SENDGRID]: () => {
    return SendGridMailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(sendgridConfig)],
      useFactory: (config: ConfigType<typeof sendgridConfig>) => config,
      inject: [sendgridConfig.KEY],
    });
  },
};

export default mailerModulesContainer;
