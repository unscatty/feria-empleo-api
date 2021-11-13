import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { IMailerService } from '../../interfaces';
import { MailgunModule } from './implementation/mailgun.module';
import MailgunMailerService from './mailgun-mailer.service';

@Module({})
export class MailgunMailerModule {
  static forRootAsync(options: Parameters<typeof MailgunModule.forRootAsync>[0]): DynamicModule {
    const mailerServiceProvider: ClassProvider<IMailerService> = {
      provide: IMailerService,
      useClass: MailgunMailerService,
    };

    return {
      module: MailgunMailerModule,
      imports: [...options.imports, MailgunModule.forRootAsync(options)],
      providers: [mailerServiceProvider],
      exports: [mailerServiceProvider],
    };
  }
}
