import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from '../auth/decorators/public.decorator';
import { Allow } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { RoleType, User } from '../user/entities/user.entity';
import { CreateJobPostDto, FilterJobPostsDto, UpdateJobPostDto } from './dto';
import { JobPost } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';

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
  @Allow(RoleType.COMPANY)
  @UseInterceptors(FileInterceptor('image'))
  createJobPost(
    @Body() createJobPostDto: CreateJobPostDto,
    @UploadedFile() image: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<JobPost> {
    if (image) {
      createJobPostDto.image = image;
    }
    return this.jobPostService.createJobPost(createJobPostDto, user);
  }

  @Put('/:id')
  @Allow(RoleType.COMPANY)
  @UseInterceptors(FileInterceptor('image'))
  updateJobPost(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,

    @Body() updateJobPostDto: UpdateJobPostDto,
    @GetUser() user: User,
  ): Promise<JobPost> {
    if (image) {
      updateJobPostDto.image = image;
    }
    return this.jobPostService.updateJobPost(id, updateJobPostDto, user);
  }

  @Delete(':id')
  @Allow(RoleType.COMPANY, RoleType.ADMIN)
  deleteJobPost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<JobPost> {
    return this.jobPostService.deleteJobPost(id, user);
  }

  @Post('/:id/apply')
  @Allow(RoleType.CANDIDATE)
  applyToJobPost(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ apply: boolean }> {
    return this.jobPostService.applyToJobPost(id, user);
  }
}
