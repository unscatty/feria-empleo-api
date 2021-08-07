import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from '../job-post/entities/job-post.entity';
import { TopJobPostsController } from './top-job-posts.controller';
import { TopJobPostsService } from './top-job-posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [TopJobPostsController],
  providers: [TopJobPostsService],
})
export class TopJobPostsModule {}
