import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { companyLabels } from './company-labels';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CustomLogger } from '../../library/logger';
import { Email } from 'src/core/providers/mail/email';
import { EmailService } from 'src/core/providers/mail/email.service';
import { EnvConfig } from 'src/config/config.keys';
import { IEmail } from 'src/shared/interfaces/';
import invitationTemplate from 'src/templates/invitation-template';

// config();

@Injectable()
export class CompanyEmailService {
  private logger = new CustomLogger('CompanyEmailService');
  constructor(
    private mailService: EmailService,
    private config: ConfigService,
  ) {}

  public async sendInvitation(companyToInvite: CreateCompanyDto) {
    try {
      const url = this.buildUrl(companyToInvite);
      const template = this.setInvitationTemplate(companyToInvite, url);
      const mail = this.createEmailOptions(companyToInvite, template);

      await this.mailService.sendEmail(mail);
    } catch (error) {
      this.logger.error(error);
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
      this.config.get(EnvConfig.CLIENT_URL) +
      '/empresas/verificar-invitacion?token=' +
      token
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
    return new Email(mailOption);
  }
}
