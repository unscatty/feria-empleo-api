import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { EnvConfig } from 'src/config/config.keys';
import { JWT } from 'src/library/jwt';
import { CustomLogs } from 'src/library/winston/winston.logs';
import { Email } from 'src/providers/mail/email';
import { IEmail } from 'src/providers/mail/email.interface';
import { EmailService } from 'src/providers/mail/email.service';
import invitationTemplate from 'src/templates/invitation-template';
import { companyLabels } from './company-labels';
import { CreateCompanyDto } from './dto/create-company.dto';

// config();

@Injectable()
export class CompanyEmailService {
  constructor(
    private mailService: MailerService,
    private config: ConfigService,
  ) {}

  public async sendInvitation(companyToInvite: CreateCompanyDto) {
    try {
      const url = this.buildUrl(companyToInvite);
      const template = this.setInvitationTemplate(companyToInvite, url);
      // const mail = this.createEmailOptions(companyToInvite, template);

      await this.mailService.sendMail({
        to: companyToInvite.email,
        html: template,
        subject: companyLabels.mailHeader,
      });
    } catch (error) {
      CustomLogs.logError(error);
      throw error;
    }
  }

  private setInvitationTemplate(
    companyToInvite: CreateCompanyDto,
    url: string,
  ) {
    let template = invitationTemplate;
    template = template.replace('$name', companyToInvite.name);
    template = template.replace('$url', url);
    return template;
  }

  private buildUrl(companyToInvite: CreateCompanyDto): string {
    // const token = JWT.sign(companyToInvite.email);
    const token = sign(
      { email: companyToInvite.email },
      this.config.get(EnvConfig.JWT_SECRET),
      {
        expiresIn: '7 days',
      },
    );
    return (
      this.config.get(EnvConfig.CLIENT_URL) + '/register-company?token=' + token
    );
  }

  private createEmailOptions(
    companyToInvite: CreateCompanyDto,
    template: string,
  ): Email {
    const mailOption: IEmail = {
      header: companyLabels.mailHeader,
      from: process.env.EMAIL_FROM,
      password: process.env.EMAIL_PASSWORD,
      server: process.env.EMAIL_SERVER,
      to: companyToInvite.email,
      message: template,
    };
    console.log(mailOption);

    return new Email(mailOption);
  }
}
