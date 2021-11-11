import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { IMailerService } from '../../interfaces/mailer.service.interface';
import { SendGridModule } from './implementation/sendgrid.module';
import SendgridMailerService from './sendgrid-mailer.service';

@Module({})
export class SendGridMailerModule {
  static forRootAsync(options: Parameters<typeof SendGridModule.forRootAsync>[0]): DynamicModule {
    const mailerServiceProvider: ClassProvider<IMailerService> = {
      provide: IMailerService,
      useClass: SendgridMailerService,
    };

    return {
      module: SendGridMailerModule,
      imports: [...options.imports, SendGridModule.forRootAsync(options)],
      providers: [mailerServiceProvider],
      exports: [mailerServiceProvider],
    };
  }
}
