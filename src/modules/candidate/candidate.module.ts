import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './models/candidate.entity';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { ContactDetail } from '../user/entities/contact-detail.entity';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate, User, ContactDetail]),
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
  controllers: [CandidateController],
  providers: [CandidateService],
})
export class CandidateModule {}
