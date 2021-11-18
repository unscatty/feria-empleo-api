import { Injectable } from '@nestjs/common';
import { Email } from './email.interfaces';

@Injectable()
export abstract class IMailerService {
  abstract sendMail(email: Email): Promise<void>;
}
