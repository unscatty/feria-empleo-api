import { AzureStorageModule, AzureStorageService } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/config/config.keys';
import { EmailService } from 'src/core/providers/mail/email.service';
import { UploadedImage } from 'src/core/entities/uploaded-image.entity';
import { Role } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { CompanyEmailService } from './company-mail.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, Role, UploadedImage]),
    CoreModule,
    UserModule,
    AzureStorageModule.withConfigAsync({
      useFactory: (config: ConfigService) => ({
        sasKey: config.get(EnvConfig.AZURE_STORAGE_SAS_KEY),
        accountName: config.get(EnvConfig.AZURE_STORAGE_ACCOUNT),
        containerName: config.get(EnvConfig.AZURE_STORAGE_CONTAINER_NAME),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, EmailService, CompanyEmailService, AzureStorageService],
})
export class CompanyModule {}
