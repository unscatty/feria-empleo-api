import { ISendMailOptions } from '@nestjs-modules/mailer';
import { MailDataRequired } from '@sendgrid/mail';

export type IMailerData = MailDataRequired | ISendMailOptions;

type Email = IMailerData;

export default Email;
