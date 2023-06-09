import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Email, IMailerService } from 'src/core/mailer';
import { getApplyTemplate } from 'src/templates/apply.template';
import { EntityManager, FindOneOptions, getManager, InsertResult, Repository, In } from 'typeorm';
import { UploadedImage } from '../../core/entities/uploaded-image.entity';
import { getSlug } from '../../shared/utils';
import { Candidate } from '../candidate/models/candidate.entity';
import { Company } from '../company/entities/company.entity';
import { SkillSet } from '../skill-set/entities/skill-set.entity';
import { RoleType, User } from '../user/entities/user.entity';
import { CreateJobPostDto, FilterJobPostsDto, UpdateJobPostDto } from './dto';
import { JobApplication, JobPost, JobPostTag } from './entities';
@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(UploadedImage)
    private uploadedImageRepository: Repository<UploadedImage>,
    private readonly azureStorage: AzureStorageService,
    private mailService: IMailerService
  ) {}

  async findAllJobPosts(dto: FilterJobPostsDto): Promise<Pagination<JobPost>> {
    const query = this.jobPostRepository.createQueryBuilder('job_post');
    query.orderBy('job_post.id', 'DESC');

    const paginationOptions: IPaginationOptions = {
      page: dto.page,
      limit: 100,
    };
    if (dto) {
      query.leftJoinAndSelect('job_post.tags', 'tags');
      query.leftJoinAndSelect('job_post.image', 'image');

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
      if (dto.experience) {
        query.andWhere('job_post.experience = :experience', {
          experience: dto.experience,
        });
      }
      if (dto.search) {
        query.andWhere('(job_post.job_title LIKE :search OR job_post.description LIKE :search)', {
          search: `%${dto.search}%`,
        });
      }
      if (dto.salaryMinGte) {
        query.andWhere('job_post.salaryMin >= :salaryMinGte', {
          salaryMinGte: dto.salaryMinGte,
        });
      }
      if (dto.salaryMaxLte) {
        query.andWhere('job_post.salaryMax <= :salaryMaxLte', {
          salaryMaxLte: dto.salaryMaxLte,
        });
      }
      if (typeof dto.isActive !== 'undefined') {
        query.andWhere('job_post.is_active = :isActive', {
          isActive: dto.isActive,
        });
      }
      query.select(['job_post', 'tags.name', 'image.imageURL']);
    }
    query.innerJoinAndSelect('job_post.company', 'company');
    return paginate<JobPost>(query, paginationOptions);
  }

  async jobPostsGlobalSearch(search: string): Promise<any[]> {
    const query = this.jobPostRepository.createQueryBuilder('job_post');
    query.leftJoinAndSelect('job_post.image', 'image');
    query.leftJoinAndSelect('job_post.company', 'company');

    query.andWhere('(job_post.job_title LIKE :search OR job_post.description LIKE :search)', {
      search: `%${search}%`,
    });
    query.select(['job_post.id', 'job_post.job_title', 'image.imageURL', 'company.name']);

    const res = await query.execute();
    const response = res.map((j) => ({
      id: j.job_post_id,
      jobTitle: j.job_title,
      image: j.image_image_url,
      companyName: j.company_name,
    }));
    return response;
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
    image?: UploadedFileMetadata
  ): Promise<JobPost> {
    // start transaction
    return await getManager().transaction(async (manager) => {
      const newJobPost = manager.create(JobPost, createJobPostDto as any);
      if (!user.company) {
        user.company = await manager.findOne(Company, { where: { user: user.id } });
      }
      newJobPost.company = user.company;

      if (image) {
        const subFolder = getSlug(user.company.name) + '/';
        image.originalname = `job-posts/${subFolder}${new Date().toISOString()}-${
          image.originalname
        }`;
        const imageURL = await this.azureStorage.upload(image);
        const newImage = this.uploadedImageRepository.create({ imageURL });
        newJobPost.image = newImage;
      }

      const jobPostSaved = await manager.save(newJobPost);
      if (createJobPostDto.skillSets && createJobPostDto.skillSets.length > 0) {
        await this.handleJobPostTags(jobPostSaved.id, createJobPostDto.skillSets, manager);
      }
      return jobPostSaved;
    });
  }

  async updateJobPost(
    id: number,
    dto: UpdateJobPostDto,
    user: User,
    image?: UploadedFileMetadata
  ): Promise<JobPost> {
    return await getManager().transaction(async (manager) => {
      const findQuery: FindOneOptions<JobPost> = { where: { id } };

      // if a new array of tags is sent join with skillSets
      if (dto.skillSets) {
        findQuery.relations = ['tags'];
      }

      const currentJobPost = await this.jobPostRepository.findOne(findQuery);
      const company = await manager.findOne(Company, { where: { user: user.id } });

      // check job post belongs to the company
      if (!currentJobPost || currentJobPost.company.id != company.id) {
        throw new NotFoundException('JOB_POST_NOT_FOUND');
      }

      // update current job post
      manager.merge(JobPost, currentJobPost, dto as any);

      if (image) {
        const imageURL = await this.azureStorage.upload(image);
        const newImage = this.uploadedImageRepository.create({ imageURL });
        currentJobPost.image = newImage;
      }

      const jobPostRes = await manager.save(currentJobPost);

      if (dto.skillSets) {
        const skillSetsWithSlug = this.getSkillSetsWithSlug(dto.skillSets);
        // get the new skill sets to insert
        const skillSetsToInsert = skillSetsWithSlug.filter(
          (s) => !currentJobPost.tags.some((sDb) => sDb.slug === s.slug)
        );

        // get  skill sets to remove
        const skillSetsToDelete = currentJobPost.tags.filter(
          (sDb) => !skillSetsWithSlug.some((s) => sDb.slug === s.slug)
        );

        if (skillSetsToDelete.length > 0) {
          await manager
            .createQueryBuilder()
            .from(JobPostTag, 'tags')
            .delete()
            .where({
              tagId: In(skillSetsToDelete.map((s) => s.id)),
              jobPostId: id,
            })
            .execute();
        }

        if (skillSetsToInsert.length > 0) {
          await this.handleJobPostTags(id, skillSetsToInsert, manager);
        }
      }
      return jobPostRes;
    });
  }

  async deleteJobPost(id: number, user: User): Promise<JobPost> {
    return await getManager().transaction(async (manager) => {
      const currentJobPost = await this.findOneJobPost(id);
      const company = await manager.findOne(Company, { where: { user: user.id } });

      // check job post belongs to the company and is not admin user
      if (user.role.name !== RoleType.ADMIN && currentJobPost.company.id != company.id) {
        throw new NotFoundException('JOB_POST_NOT_FOUND');
      }
      this.jobPostRepository.merge(currentJobPost, { isActive: false });
      return this.jobPostRepository.save(currentJobPost);
    });
  }

  async applyToJobPost(jobPostId: number, candidate: Candidate) {
    let jobApplication: JobApplication;
    const jobPostExists = await this.findOneJobPost(jobPostId);
    if (!jobPostExists.isActive) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    return await getManager().transaction(async (manager) => {
      jobApplication = await manager.findOne(JobApplication, {
        jobPost: jobPostExists.id,
        candidate: candidate.id,
      });
      if (jobApplication) {
        throw new ConflictException('ALREADY_APPLY_TO_JOB');
      }
      // insert the new job application
      jobApplication = await manager.create(JobApplication, {
        jobPost: jobPostExists.id,
        candidate: candidate.id,
      });
      await manager.save(jobApplication);
      const template = getApplyTemplate(candidate, jobPostExists.jobTitle);
      const mailOptions = this.createEmailOptions(jobPostExists.company, template, jobPostExists);
      await this.mailService.sendMail(mailOptions);

      return { apply: true };
    });
  }

  async handleJobPostTags(
    jobPostId: number,
    skillSets: { name: string }[],
    manager: EntityManager
  ): Promise<JobPostTag[]> {
    // get a new array with the slug value
    const skillSetsWithSlug = this.getSkillSetsWithSlug(skillSets);

    // find all skill sets that already exists in database
    const skillSetsInDb = await manager
      .createQueryBuilder(SkillSet, 'skill')
      .where({
        slug: In(skillSetsWithSlug.map((s) => s.slug)),
      })
      .getMany();

    // find  skill sets that does not exists in database
    const newSkillSets = skillSetsWithSlug.filter(
      (s) => !skillSetsInDb.some((sDb) => sDb.slug === s.slug)
    );

    let skillSetsInserted: InsertResult = null;
    if (newSkillSets.length > 0) {
      // insert all new skill sets
      skillSetsInserted = await manager
        .createQueryBuilder()
        .insert()
        .into(SkillSet)
        .values(newSkillSets)
        .execute();
    }

    // concat the inserted skillSets with the found skillSets
    const skillIds: number[] = [
      ...(skillSetsInserted ? skillSetsInserted.identifiers.map((i) => i.id) : []),
      ...skillSetsInDb.map((s) => s.id),
    ];
    const tags: JobPostTag[] = skillIds.map((id) =>
      manager.create(JobPostTag, {
        tagId: id,
        jobPostId,
      })
    );
    // save post tags
    return manager.save(tags);
  }

  getSkillSetsWithSlug(skillSets: { name: string }[]) {
    const skillSetsWithSlug: { name: string; slug: string }[] = [];
    for (const skill of skillSets) {
      skillSetsWithSlug.push({
        name: skill.name,
        slug: getSlug(skill.name),
      });
    }
    return skillSetsWithSlug;
  }

  async getAppliedCandidatesToJob(jobPostId: number) {
    const query = await this.jobApplicationRepository
      .createQueryBuilder('jobA')
      .andWhere('jobA.jobPost = :jobPostId', { jobPostId })
      .leftJoinAndSelect('jobA.candidate', 'candidate')
      .leftJoinAndSelect('candidate.user', 'user')
      .getMany();
    return query;
  }

  private createEmailOptions(company: Company, template: string, jobPost: JobPost): Email {
    const mailOption: Email = {
      subject: `Aplicación a la vacante ${jobPost.jobTitle}`,
      to: company.activeEmail,
      html: template,
    };

    return mailOption;
  }
}
