import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @OneToMany((type) => User, (user) => user.role)
  users: User[];

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
