import { DynamicModule } from '@nestjs/common';
import MailerStrategy from '../mailer-strategy';

type MailerModuleContainer = {
  [key in MailerStrategy]: () => DynamicModule;
};

export default MailerModuleContainer;
