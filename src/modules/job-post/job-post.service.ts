import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { getManager, Repository } from 'typeorm';
import { RoleType, User } from '../user/entities/user.entity';
import { CreateJobPostDto, FilterJobPostsDto } from './dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobApplication } from './entities/job-application.entity';
import { JobPostTag } from './entities/job-post-tag.entity';
import { JobPost } from './entities/job-post.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async findAllJobPosts(dto: FilterJobPostsDto): Promise<Pagination<JobPost>> {
    const query = this.jobPostRepository.createQueryBuilder('job_post');
    const paginationOptions: IPaginationOptions = {
      page: dto.page,
      limit: dto.limit,
    };
    if (dto) {
      if (dto.companyId) {
        query.andWhere('job_post.company = :company', {
          company: dto.companyId,
        });
      }
      if (dto.jobMode) {
        query.andWhere('job_post.job_mode = :jobMode', {
          jobMode: dto.jobMode,
        });
      }
      if (dto.jobType) {
        query.andWhere('job_post.job_type = :jobType', {
          jobType: dto.jobType,
        });
      }
      if (dto.search) {
        query.andWhere(
          '(job_post.job_title LIKE :search OR job_post.description LIKE :search)',
          { search: `%${dto.search}%` },
        );
      }
      if (typeof dto.isActive !== 'undefined') {
        query.andWhere('job_post.is_active = :isActive', {
          isActive: dto.isActive,
        });
      }
    }
    return paginate<JobPost>(query, paginationOptions);
  }

  async findOneJobPost(id: number): Promise<JobPost> {
    const currentJobPost = await this.jobPostRepository.findOne({
      id,
    });
    if (!currentJobPost) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    return currentJobPost;
  }

  async createJobPost(
    createJobPostDto: CreateJobPostDto,
    user: User,
  ): Promise<JobPost> {
    // start transaction
    return await getManager().transaction(async (manager) => {
      const newJobPost = manager.create(JobPost, createJobPostDto);
      newJobPost.company = user.company;

      const jobPostRes = await manager.save(newJobPost);
      const tags: JobPostTag[] = [];
      const ids = createJobPostDto.skillSetIds;
      // create the corresponding tags and store them in array
      for (let i = 0; i < ids.length; i++) {
        const tag = manager.create(JobPostTag, {
          tagId: ids[i],
          jobPostId: jobPostRes.id,
        });
        tags.push(tag);
      }
      try {
        await manager.save(tags);
      } catch (err) {
        // error code when entity not exist
        if (err.errno === 1452) {
          throw new NotFoundException({
            message: 'skill set id does not exists, id = ' + err.parameters[1],
          });
        }
        throw new InternalServerErrorException(err);
      }
      return jobPostRes;
    });
  }

  async updateJobPost(
    id: number,
    updateJobPostDto: UpdateJobPostDto,
    user: User,
  ): Promise<JobPost> {
    const currentJobPost = await this.jobPostRepository.findOne({
      where: { id },
    });
    // check job post belongs to the company
    if (!currentJobPost || currentJobPost.company.id != user.company.id) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    return await getManager().transaction(async (manager) => {
      if (updateJobPostDto.skillSetIds) {
        // delete all tags of a job post
        await manager
          .createQueryBuilder(JobPostTag, 'job_tag')
          .delete()
          .where({ jobPostId: currentJobPost.id })
          .execute();

        // create a new array of tags to insert
        const tags: JobPostTag[] = [];
        const ids = updateJobPostDto.skillSetIds;
        for (let i = 0; i < ids.length; i++) {
          const tag = manager.create(JobPostTag, {
            tagId: ids[i],
            jobPostId: currentJobPost.id,
          });
          tags.push(tag);
        }
        try {
          await manager.save(tags);
        } catch (err) {
          // error code when entity not exist
          if (err.errno === 1452) {
            throw new NotFoundException({
              message:
                'skill set id does not exists, id = ' + err.parameters[1],
            });
          }
          throw new InternalServerErrorException(err);
        }
      }

      // update current job post
      manager.merge(JobPost, currentJobPost, updateJobPostDto);
      return manager.save(currentJobPost);
    });
  }

  async deleteJobPost(id: number, user: User): Promise<JobPost> {
    const currentJobPost = await this.findOneJobPost(id);
    // check job post belongs to the company and is not admin user
    if (
      user.role.name !== RoleType.ADMIN &&
      currentJobPost.company.id != user.company.id
    ) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    this.jobPostRepository.merge(currentJobPost, { isActive: false });
    return this.jobPostRepository.save(currentJobPost);
  }

  async applyToJobPost(jobPostId: number, user: User) {
    const jobPostExists = await this.findOneJobPost(jobPostId);
    if (!jobPostExists.isActive) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }

    // find if user already apply to job
    const jobApplication = this.jobApplicationRepository.findOne({
      jobPostId,
      candidateId: user.candidate.id,
    });
    if (jobApplication) {
      throw new ConflictException('ALREADY_APPLY_TO_JOB');
    }
    // insert the new job application
    try {
      const jobApplication = this.jobApplicationRepository.create({
        jobPostId,
        candidateId: user.candidate.id,
      });
      console.log(jobApplication);

      await this.jobApplicationRepository.save(jobApplication);
    } catch (error) {
      throw new BadRequestException('FAILED_TO_APPLY_JOB');
    }
    return { apply: true };
  }
}
