import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JobPostService } from './job-post.service';

@Controller('job-posts')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }
}
