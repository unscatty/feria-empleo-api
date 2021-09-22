import {Email} from "./email";
import {createTransport} from "nodemailer";
import * as smtpTransport from "nodemailer-smtp-transport";
import { Injectable } from "@nestjs/common";

interface MailOptions {
  from: string,
  to: string,
  subject: string,
  html: string
}
/**
 * @export
 * @class EmailService
 */
@Injectable()
export class EmailService {
    private transporter: any;
    private mailOptions : MailOptions;

    /**
     *Creates an instance of EmailService.
     * @memberof EmailService
     */
    constructor() {
      this.mailOptions = {from: "", to: "",
        subject: "", html: ""};
    }

    /**
     * @param {Email} mail
     * @return {Promise<string>}
     * @memberof EmailService
     */
    public sendEmail(mail: Email): Promise<string> {
      const promise: Promise<string> =
       new Promise((resolve, reject) => {
         this.createTransporter(mail);
         this.setMailOptions(mail);
         this.transporter.sendMail(this.mailOptions,
             (err: Error | null, value: string ) => {
               if (err) {
                 return reject(err);
               }
               return resolve(value);
             });
       });
      return promise;
    }

    /**
     *
     *
     * @private
     * @param {Email} mail
     * @memberof EmailService
     */
    private createTransporter(mail: Email): void {
      this.transporter = createTransport(smtpTransport({
        service: mail.server,
        secure: true,
        auth: {
          user: mail.from,
          pass: mail.password,
        },
      }));
    }

    /**
     *
     *
     * @private
     * @param {Email} mail
     * @memberof EmailService
     */
    private setMailOptions(mail: Email): void {
      this.mailOptions = {
        from: mail.from,
        to: mail.to,
        subject: mail.header,
        html: mail.message,
      };
    }
}
