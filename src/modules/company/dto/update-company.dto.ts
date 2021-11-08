import { IsEnum, IsObject, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { CompanyUseEmailOptions } from '../entities/company.entity';

export class UpdateCompanyDto {
  @MaxLength(255)
  @IsString()
  @IsOptional()
  readonly name?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  readonly description?: string;

  @MaxLength(255)
  @IsUrl()
  @IsOptional()
  readonly videoUrl?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  readonly staff?: string;

  // @MaxLength(500)
  // @IsUrl()
  // @IsOptional()
  // readonly imageUrl?: string;

  @IsObject()
  @IsOptional()
  readonly user?: UpdateUserDto;

  @IsEnum(CompanyUseEmailOptions)
  @IsOptional()
  readonly useEmail?: CompanyUseEmailOptions;
}
