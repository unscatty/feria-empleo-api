import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 10;
}
