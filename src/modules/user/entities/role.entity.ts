import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.CANDIDATE,
  })
  name: RoleType;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
