import { AzureStorageModule } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/config/config.keys';
import { JobApplication } from './entities/job-application.entity';
import { JobPostTag } from './entities/job-post-tag.entity';
import { JobPost } from './entities/job-post.entity';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { UploadedImage } from 'src/shared/entitities/uploaded-image.entity';
import { getSlug } from '../../shared/utils/common.utils';
import { Company } from '../company/entities/company.entity';
import { EmailService } from 'src/core/providers/mail/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost, JobApplication, JobPostTag, UploadedImage, Company]),
    AzureStorageModule.withConfigAsync({
      useFactory: (config: ConfigService) => ({
        sasKey: config.get(EnvConfig.AZURE_STORAGE_SAS_KEY),
        accountName: config.get(EnvConfig.AZURE_STORAGE_ACCOUNT),
        containerName: config.get(EnvConfig.AZURE_STORAGE_CONTAINER_NAME),
      }),
      inject: [ConfigService],
    }),

    MulterModule.register({
      fileFilter: (req, file, cb) => {
        let subFolder = '';
        if (req.user && req.user.company.name) {
          subFolder = getSlug(req.user.company.name) + '/';
        }
        file.originalname = `job-posts/${subFolder}${new Date().toISOString()}-${
          file.originalname
        }`;
        cb(null, true);
      },
    }),
  ],
  controllers: [JobPostController],
  providers: [JobPostService, EmailService],
})
export class JobPostModule {}
