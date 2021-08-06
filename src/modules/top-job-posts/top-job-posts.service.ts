import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { JobPost } from '../job-post/entities/job-post.entity';

@Injectable()
export class TopJobPostsService {
  private queryBuilder: () => SelectQueryBuilder<JobPost>;

  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
  ) {
    this.queryBuilder = () => jobPostRepository.createQueryBuilder('jp');
  }

  async topApplied(limit: number) {
    return this.queryBuilder()
      .innerJoin('job_application', 'ja', 'ja.job_post_id = jp.id')
      .groupBy('ja.job_post_id')
      .orderBy('COUNT(ja.job_post_id)', 'DESC')
      .limit(limit)
      .getMany();
  }
}
