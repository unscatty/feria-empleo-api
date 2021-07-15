import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/modules/user/entities/user.entity';

/**
 *
 * @param { RoleType[] } roles - Start with higher role for granularity (or) lower role for specificity
 */
export const Allow = (...roles: RoleType[]): CustomDecorator<string> =>
  SetMetadata('allow', roles);

/**
 *
 * @param  { RoleType[] } roles - Add list of roles to deny resource
 */
export const Deny = (...roles: RoleType[]): CustomDecorator<string> =>
  SetMetadata('deny', roles);
