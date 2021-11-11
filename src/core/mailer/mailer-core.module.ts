import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailerCoreModuleOptions } from './interfaces/mailer-core-module-options.interface';
import MailerModuleContainer from './interfaces/mailer-module-container.interface';
import MailerStrategy from './mailer-strategy';

@Global()
@Module({})
export class MailerCoreModule {
  static forRoot(options: MailerCoreModuleOptions): DynamicModule {
    return {
      ...this.createMailerModule(options.strategy, options.modules),
      module: MailerCoreModule,
    };
  }

  static createMailerModule(
    strategy: MailerStrategy,
    modules: MailerModuleContainer
  ): DynamicModule {
    return modules[strategy]();
  }
}
