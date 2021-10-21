import { ExcludeToPlain } from 'src/shared/decorators/class-transform';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

const roleGroupPrefix = 'role:';
// To group when serializing
export const RoleGroup = {
  ADMIN: roleGroupPrefix + RoleType.ADMIN,
  CANDIDATE: roleGroupPrefix + RoleType.CANDIDATE,
  COMPANY: roleGroupPrefix + RoleType.COMPANY,
  CURRENT_USER: roleGroupPrefix + 'CURRENT_USER',
};

@Entity()
export class Role extends BaseEntity {
  @ExcludeToPlain()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.CANDIDATE,
  })
  name: RoleType;

  get group(): string {
    return roleGroupPrefix + this.name;
  }

  // Timestamps

  @ExcludeToPlain()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
