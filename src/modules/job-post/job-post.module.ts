import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostController } from './job-post.controller';
import { JobPost } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
