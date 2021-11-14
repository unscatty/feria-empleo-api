import { Logger } from '@nestjs/common';
import { MailerCoreModuleConstants } from './interfaces/mailer-core.constants';

export const mailerCoreModuleLogger = new Logger(MailerCoreModuleConstants.MAILER_CORE_MODULE);
