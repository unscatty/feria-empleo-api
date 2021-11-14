import { DynamicModule, Global, Module } from '@nestjs/common';
import { getEnumKeyByEnumValue } from 'src/shared/utils';
import { MailerCoreModuleOptions } from './interfaces/mailer-core-module-options.interface';
import MailerModuleContainer from './interfaces/mailer-module-container.interface';
import { mailerCoreModuleLogger } from './mailer-core-module.logger';
import MailerStrategy from './mailer-strategy';

@Global()
@Module({})
export class MailerCoreModule {
  static forRoot(options: MailerCoreModuleOptions): DynamicModule {
    const mailerModule = this.createMailerModule(options.strategy, options.modules);

    mailerCoreModuleLogger.log(
      `Using mailer: ${getEnumKeyByEnumValue(MailerStrategy, options.strategy)}`
    );

    return {
      ...mailerModule,
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
