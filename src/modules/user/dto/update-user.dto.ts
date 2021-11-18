import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @MaxLength(255)
  @IsString()
  @IsOptional()
  readonly name: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  readonly lastname: string;
}
