import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly salaryMin: number;

  @IsNotEmpty()
  @IsNumber()
  readonly salaryMax: number;

  @IsOptional()
  @ValidateNested({ each: true })
  readonly skillSets: CreateSkillSetDto[];
}
