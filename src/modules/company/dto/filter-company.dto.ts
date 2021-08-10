import { IsOptional } from 'class-validator';

export class CompanyFilter {
  @IsOptional()
  id: number;
}
