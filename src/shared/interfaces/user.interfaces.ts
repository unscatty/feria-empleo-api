import { RoleType } from 'src/modules/user/user.entity';
export interface IJwtPayload {
  id: number;
  email: string;
  role: RoleType;
}
