import { ModuleMetadata } from '@nestjs/common';
import MailerStrategy from '../mailer-strategy';
import MailerModuleContainer from './mailer-module-container.interface';

export interface MailerCoreModuleOptions {
  strategy: MailerStrategy;
  modules: MailerModuleContainer;
}

export interface MailerCoreModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<MailerCoreModuleOptions> | MailerCoreModuleOptions;
}
