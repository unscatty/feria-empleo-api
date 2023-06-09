import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { JobPost } from '../job-post/entities/job-post.entity';

@Injectable()
export class TopJobPostsService {
  private queryBuilder: () => SelectQueryBuilder<JobPost>;

  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>
  ) {
    this.queryBuilder = () => jobPostRepository.createQueryBuilder('jp');
  }

  async topApplied(limit: number) {
    const groupByCondition = `
    ja.job_post_id, jp.id, jp.is_active, jp.jobTitle, jp.description, jp.requirements, jp.experience,
    jp.jobType, jp.jobMode, jp.salaryMin,  jp.salaryMax, jp.views, jp.createdAt,
    jp.updatedAt, jp.company_id,  jp.image_id, jp.id`;
    return this.queryBuilder()
      .innerJoin('job_application', 'ja', 'ja.job_post_id = jp.id')
      .groupBy(groupByCondition)
      .orderBy('COUNT(ja.job_post_id)', 'DESC')
      .limit(limit)
      .getMany();
  }

  async topNew(limit: number) {
    return this.jobPostRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async topViewed(limit: number) {
    const groupByCondition = `
    jp.isActive, jp.jobTitle, jp.description, jp.requirements, jp.experience, jp.jobType, jp.jobMode, jp.salaryMin,
    jp.salaryMax, jp.views, jp.createdAt, jp.updatedAt, jp.image_id, jp.id, jp.company_id
    `;
    return this.queryBuilder()
      .groupBy(groupByCondition)
      .orderBy('jp.views', 'DESC')
      .limit(limit)
      .getMany();
  }
}
