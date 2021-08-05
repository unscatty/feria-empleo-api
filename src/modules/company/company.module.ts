import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './entities/company.entity';
import { CompanyController } from './company.controller';
import { CompanyEmailService } from './company-mail.service';
import { CompanyService } from './company.service';
import { EmailService } from 'src/providers/mail/email.service';
import { Role } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Company, Role])],
    controllers: [ CompanyController ],
    providers: [ CompanyService, EmailService, CompanyEmailService ]
})
export class CompanyModule {}
