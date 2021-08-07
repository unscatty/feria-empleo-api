import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateJobPostDto {
  @IsNotEmpty()
  readonly jobTitle: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly requirements: string;

  @IsOptional()
  readonly imageUrl: string;

  @IsOptional()
  readonly experience: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly salaryMin: number;

  @IsNotEmpty()
  @IsNumber()
  readonly salaryMax: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  readonly skillSetIds: number[];
}
