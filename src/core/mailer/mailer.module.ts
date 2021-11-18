import { Module } from '@nestjs/common';
import mailerConfig from './config/mailer.config';
import { MailerCoreModule } from './mailer-core.module';

@Module({
  imports: [MailerCoreModule.forRoot(mailerConfig())],
})
export class MailerModule {}
