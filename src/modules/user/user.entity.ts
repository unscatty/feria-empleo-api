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

  @Column({ type: 'varchar', length: 25, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, default: RoleType.STUDENT })
  role: RoleType;

  @Column({ type: 'varchar', nullable: true })
  school: string;

  @Column({ type: 'varchar', nullable: true })
  boleta: string;

  //TODO join with employer table
  /* @JoinColumn({ name: 'employer_id' })
  @OneToOne((type) => Employer, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  employer: Employer; */

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;
}
