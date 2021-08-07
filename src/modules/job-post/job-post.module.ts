import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { JobPostTag } from './entities/job-post-tag.entity';
import { JobPost } from './entities/job-post.entity';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, JobApplication, JobPostTag])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
