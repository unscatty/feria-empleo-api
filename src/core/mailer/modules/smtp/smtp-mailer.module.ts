import { MailerModule as NodeMailerModule, MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { IMailerService } from '../../interfaces/mailer-service.interface';
import SMTPMailerService from './smtp-mailer.service';

@Module({})
export class SMTPMailerModule {
  static forRootAsync(options: Parameters<typeof NodeMailerModule.forRootAsync>[0]): DynamicModule {
    const mailerServiceProvider: ClassProvider<IMailerService> = {
      provide: IMailerService,
      useClass: SMTPMailerService,
    };

    return {
      module: SMTPMailerModule,
      imports: [...options.imports, NodeMailerModule.forRootAsync(options)],
      providers: [
        {
          provide: MAILER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        mailerServiceProvider,
      ],
      exports: [mailerServiceProvider],
    };
  }
}
