import { Logger } from '@nestjs/common';
import { MailgunConstants } from './mailgun.constants';

export const mailgunLogger = new Logger(MailgunConstants.MAILGUN_MODULE);
