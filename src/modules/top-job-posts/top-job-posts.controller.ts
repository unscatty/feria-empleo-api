import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { TopJobPostsQueryDto } from './dto/top-job-posts-query.dto';
import { TopJobPostsService } from './top-job-posts.service';

@Controller('top-job-posts')
export class TopJobPostsController {
  constructor(private topJobPostsService: TopJobPostsService) {}

  @Public()
  @Get('applied')
  topApplied(@Query() queryDto: TopJobPostsQueryDto) {
    return this.topJobPostsService.topApplied(queryDto.limit);
  }
}
