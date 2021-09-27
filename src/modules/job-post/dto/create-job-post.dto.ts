import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { CreateSkillSetDto } from '../../skill-set/dto/create-skill-set.dto';

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

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  readonly salaryMin: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly salaryMax: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillSetDto)
  readonly skillSets: CreateSkillSetDto[];

  image: Express.Multer.File;
}
