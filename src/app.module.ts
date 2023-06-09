import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { CompanyModule } from './modules/company/company.module';
import { DatabaseModule } from './database/database.module';
import { EnvConfig } from './config/config.keys';
import { UserModule } from './modules/user/user.module';
import { JobPostModule } from './modules/job-post/job-post.module';
import { SkillSetModule } from './modules/skill-set/skill-set.module';
import { TopJobPostsModule } from './modules/top-job-posts/top-job-posts.module';
import { CoreModule } from './core/core.module';
import { MailerModule } from './core/mailer/mailer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DatabaseModule,
    MailerModule,
    UserModule,
    AuthModule,
    CandidateModule,
    CompanyModule,
    JobPostModule,
    SkillSetModule,
    TopJobPostsModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(EnvConfig.PORT);
  }
}
