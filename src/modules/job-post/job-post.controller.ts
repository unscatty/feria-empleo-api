import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Allow } from '../auth/decorators/role.decorator';
import { CreateJobPostDto, FilterJobPostsDto, UpdateJobPostDto } from './dto';
import { GetUser } from '../auth/decorators/user.decorator';
import { JobPost } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';
import { Public } from '../auth/decorators/public.decorator';
import { RoleType, User } from '../user/entities/user.entity';

@Controller('job-posts')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get()
  @Public()
  findAllJobPosts(
    @Query() filterJobPostsDto: FilterJobPostsDto,
  ): Promise<Pagination<JobPost>> {
    return this.jobPostService.findAllJobPosts(filterJobPostsDto);
  }

  @Get(':id')
  @Public()
  findOneJobPost(@Param('id') id: number) {
    return this.jobPostService.findOneJobPost(id);
  }

  @Post()
  @Allow(RoleType.EMPLOYER)
  createJobPost(
    @Body() createJobPostDto: CreateJobPostDto,
    @GetUser() user: User,
  ): Promise<JobPost> {
    return this.jobPostService.createJobPost(createJobPostDto, user);
  }

  @Put('/:id')
  @Allow(RoleType.EMPLOYER)
  updateJobPost(
    @Param('id') id: number,
    @Body() updateJobPostDto: UpdateJobPostDto,
    @GetUser() user: User,
  ): Promise<JobPost> {
    return this.jobPostService.updateJobPost(id, updateJobPostDto, user);
  }

  @Delete(':id')
  @Allow(RoleType.EMPLOYER, RoleType.ADMIN)
  deleteJobPost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<JobPost> {
    return this.jobPostService.deleteJobPost(id, user);
  }

  @Post('/:id/apply')
  @Allow(RoleType.STUDENT)
  applyToJobPost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ apply: boolean }> {
    return this.jobPostService.applyToJobPost(id, user);
  }
}
