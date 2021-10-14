import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getApplyTemplate } from 'src/templates/apply.template';
import { EntityManager, FindOneOptions, getManager, InsertResult, Repository } from 'typeorm';
import { UploadedImage } from '../../core/entities/uploaded-image.entity';
import { getSlug } from '../../shared/utils';
import { SkillSet } from '../skill-set/entities/skill-set.entity';
import { RoleType, User } from '../user/entities/user.entity';
import { CreateJobPostDto, FilterJobPostsDto, UpdateJobPostDto } from './dto';
import { JobApplication, JobPost, JobPostTag } from './entities';
import { EmailService } from '../../core/providers/mail/email.service';
import { Company } from '../company/entities/company.entity';
import { Email } from 'src/core/providers/mail/email';
import { IEmail } from 'src/shared/interfaces';
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
    private mailService: EmailService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>
  ) {}

  async findAllJobPosts(dto: FilterJobPostsDto): Promise<Pagination<JobPost>> {
    const query = this.jobPostRepository.createQueryBuilder('job_post');
    query.orderBy('job_post.id', 'DESC');

    const paginationOptions: IPaginationOptions = {
      page: dto.page,
      limit: dto.limit,
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
      newJobPost.company = user.company;

      if (image) {
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
    const findQuery: FindOneOptions<JobPost> = { where: { id } };

    // if a new array of tags is sent join with skillSets
    if (dto.skillSets) {
      findQuery.relations = ['tags'];
    }

    const currentJobPost = await this.jobPostRepository.findOne(findQuery);

    // check job post belongs to the company
    if (!currentJobPost || currentJobPost.company.id != user.company.id) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    return await getManager().transaction(async (manager) => {
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
            .where('tag_id IN (:...tags) AND job_post_id = :id', {
              tags: skillSetsToDelete.map((s) => s.id),
              id,
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
    const currentJobPost = await this.findOneJobPost(id);
    // check job post belongs to the company and is not admin user
    if (user.role.name !== RoleType.ADMIN && currentJobPost.company.id != user.company.id) {
      throw new NotFoundException('JOB_POST_NOT_FOUND');
    }
    this.jobPostRepository.merge(currentJobPost, { isActive: false });
    return this.jobPostRepository.save(currentJobPost);
  }

  async applyToJobPost(jobPostId: number, user: User) {
    try {
      let jobPostExists: JobPost;
      let jobApplication: JobApplication;
      let template: string;
      let mailOptions: Email;

      jobPostExists = await this.findOneJobPost(jobPostId);
      if (!jobPostExists.isActive) {
        throw new NotFoundException('JOB_POST_NOT_FOUND');
      }

      jobApplication = await this.jobApplicationRepository.findOne({
        jobPostId,
        candidateId: user.candidate.id,
      });
      if (jobApplication) {
        throw new ConflictException('ALREADY_APPLY_TO_JOB');
      }
      // insert the new job application
      jobApplication = this.jobApplicationRepository.create({
        jobPostId,
        candidateId: user.id,
      });
      await this.jobApplicationRepository.save(jobApplication);
      template = getApplyTemplate(user, jobPostExists.jobTitle);
      mailOptions = this.createEmailOptions(jobPostExists.company, template, jobPostExists);
      await this.mailService.sendEmail(mailOptions);
    } catch (error) {
      throw new BadRequestException('FAILED_TO_APPLY_JOB');
    }
    return { apply: true };
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
      .where('skill.slug IN (:slugs)', {
        slugs: skillSetsWithSlug.map((s) => s.slug),
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

  private createEmailOptions(company: Company, template: string, jobPost: JobPost): Email {
    const mailOption: IEmail = {
      header: `Aplicación a la vacante ${jobPost.jobTitle}`,
      from: process.env.EMAIL_FROM,
      password: process.env.EMAIL_PASSWORD,
      server: process.env.EMAIL_SERVER,
      to: company.activeEmail,
      message: template,
    };
    return new Email(mailOption);
  }
}
