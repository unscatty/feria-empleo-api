import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  EMPLOYER = 'EMPLOYER',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', {
    enum: RoleType,
    nullable: false,
    default: RoleType.STUDENT,
  })
  name: RoleType;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
