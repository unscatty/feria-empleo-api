import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

export const roleGroupPrefix = 'role:';
// To group when serializing
export const RoleGroup = {
  ADMIN: roleGroupPrefix + RoleType.ADMIN,
  CANDIDATE: roleGroupPrefix + RoleType.CANDIDATE,
  COMPANY: roleGroupPrefix + RoleType.COMPANY,
  PUBLIC: roleGroupPrefix + 'PUBLIC',
};

@Entity()
export class Role extends BaseEntity {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Expose()
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

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
