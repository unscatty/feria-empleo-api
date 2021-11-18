import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { EnvConfig } from 'src/config/config.keys';
import { Email, IMailerService } from 'src/core/mailer';
import invitationTemplate from 'src/templates/invitation-template';
import { CustomLogger } from '../../library/logger';
import { companyLabels } from './company-labels';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyEmailService {
  private logger = new CustomLogger('CompanyEmailService');
  constructor(private mailService: IMailerService, private config: ConfigService) {}

  public async sendInvitation(companyToInvite: CreateCompanyDto) {
    try {
      const url = this.buildUrl(companyToInvite);
      const template = this.setInvitationTemplate(companyToInvite, url);
      const mail = this.createEmailOptions(companyToInvite, template);

      await this.mailService.sendMail(mail);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private setInvitationTemplate(companyToInvite: CreateCompanyDto, url: string) {
    let template = invitationTemplate;
    template = template.replace('$name', companyToInvite.name);
    template = template.replace('$url', url);
    return template;
  }

  private buildUrl(companyToInvite: CreateCompanyDto): string {
    // const token = JWT.sign(companyToInvite.email);
    const token = sign({ email: companyToInvite.email }, this.config.get(EnvConfig.JWT_SECRET), {
      expiresIn: '7 days',
    });
    return this.config.get(EnvConfig.CLIENT_URL) + '/empresas/verificar-invitacion?token=' + token;
  }

  private createEmailOptions(companyToInvite: CreateCompanyDto, template: string): Email {
    const mailOption: Email = {
      subject: companyLabels.mailHeader,
      to: companyToInvite.email,
      html: template,
    };
    return mailOption;
  }
}
