import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateJobPostDto } from './create-job-post.dto';

export class UpdateJobPostDto extends PartialType(CreateJobPostDto) {
  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean;
}
