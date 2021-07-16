import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateJobPostDto {
  @IsNotEmpty()
  readonly jobTitle: string;

  readonly description: string;

  readonly requirements: string;

  @IsNumber()
  @Min(0)
  readonly salaryMin: number;

  @IsNumber()
  @Min(0)
  readonly salaryMax: number;
}
