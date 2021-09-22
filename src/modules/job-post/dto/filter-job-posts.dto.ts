import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { JobPostMode, JobPostType } from '../entities/job-post.entity';

export class FilterJobPostsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  readonly companyId: number;

  @IsOptional()
  readonly search: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return false;
    }
  })
  readonly isActive: boolean = true;

  @IsOptional()
  @IsEnum(JobPostType, {
    message: `jobType must be a valid enum value (${Object.values(
      JobPostType,
    )})`,
  })
  readonly jobType: JobPostType;

  @IsOptional()
  @IsEnum(JobPostMode, {
    message: `jobMode must be a valid enum value (${Object.values(
      JobPostMode,
    )})`,
  })
  readonly jobMode: JobPostMode;

  @IsOptional()
  readonly experience: string;
}
