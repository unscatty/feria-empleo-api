import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
