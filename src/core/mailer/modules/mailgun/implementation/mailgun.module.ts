import { DynamicModule, FactoryProvider, Module, Provider } from '@nestjs/common';
import { MailgunConstants } from './mailgun.constants';
import { MailgunModuleAsyncOptions } from './mailgun.interfaces';
import { MailgunService } from './mailgun.service';
@Module({
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailgunModule {
  static forRootAsync(options: MailgunModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MailgunModule,
      imports: options.imports || [],
      providers: asyncProviders,
    };
  }

  private static createAsyncProviders(options: MailgunModuleAsyncOptions): Provider[] {
    return [this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(options: MailgunModuleAsyncOptions): FactoryProvider {
    return {
      provide: MailgunConstants.MAILGUN_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
