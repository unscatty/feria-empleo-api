import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
export class ExperienceDetailDto {
  @IsOptional()
  @IsBoolean()
  isCurrentjob: boolean;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ValidateIf((o) => o.isCurrentjob === false)
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  /*   @IsString()
  @IsOptional()
  jobAdress: string; */
}

export class EducationDetailDto {
  @IsNotEmpty()
  @IsString()
  institutionName: string;

  /*   @IsNotEmpty()
  @IsString()
  city: string; */

  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsOptional()
  @IsBoolean()
  currentlyInSchool: boolean;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ValidateIf((o) => o.currentlyInSchool === false)
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsString()
  @IsOptional()
  description: string;
}

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  email: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDetailDto)
  experienceDetails: ExperienceDetailDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EducationDetailDto)
  educationDetails: EducationDetailDto[];

  @IsOptional()
  @IsNumber({}, { each: true })
  skillSets: number[];
}
