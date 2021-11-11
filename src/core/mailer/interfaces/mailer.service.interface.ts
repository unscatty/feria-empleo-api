import { Injectable } from '@nestjs/common';
import Email from './mailer-data.interface';

@Injectable()
export abstract class IMailerService {
  abstract sendMail(data: Email): Promise<void>;
}
