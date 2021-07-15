import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '../entities/user.entity';

/**
 * Dto to pass all filters in endpoint query
 * ej {{URL}}/users?role=employer
 */
export class FilterUsersDto {
  @IsOptional()
  @IsEnum(RoleType, {
    message: `role must be a valid enum value (${Object.values(RoleType)})`,
  })
  role: RoleType;
}
