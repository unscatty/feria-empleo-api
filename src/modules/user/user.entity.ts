import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  EMPLOYER = 'EMPLOYER',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  // TODO join with role table
  @Column({ type: 'varchar', nullable: false, default: RoleType.STUDENT })
  role: RoleType;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;
}
