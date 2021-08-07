import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class TopJobPostsQueryDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  @Min(1)
  readonly limit?: number = 5;
}
