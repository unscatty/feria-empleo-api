import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('job_posts')
export class JobPost extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'is_active', nullable: false, default: true })
  isActive!: boolean;

  @Column({ name: 'job_title', nullable: false })
  jobTitle!: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  requirements: string;

  @Column({ name: 'salary_min' })
  salaryMin: number;

  @Column({ name: 'salary_max' })
  salaryMax: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
