import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/core/providers/mail/email.service';
import { Role } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { CompanyEmailService } from './company-mail.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Role]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService, EmailService, CompanyEmailService],
})
export class CompanyModule {}
