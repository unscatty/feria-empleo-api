import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UploadedImage } from '../../../core/entities/uploaded-image.entity';
import { TransformToPlain } from '../../../shared/decorators/class-transform';
import { Company } from '../../company/entities/company.entity';
import { SkillSet } from '../../skill-set/entities/skill-set.entity';
import { JobApplication } from './job-application.entity';

export enum JobPostType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
}

export enum JobPostMode {
  OFFICE = 'office',
  HYBRID = 'hybrid',
  HOME_OFFICE = 'home_office',
}

@Entity()
export class JobPost extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: true })
  isActive!: boolean;

  @Column({ nullable: false })
  jobTitle!: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 3000, nullable: true })
  requirements: string;

  @Column({ nullable: true })
  experience: string;

  @OneToOne(() => UploadedImage, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @TransformToPlain(({ value }) => value?.imageURL)
  @JoinColumn()
  image: UploadedImage;

  @Column('simple-enum', {
    enum: JobPostType,
  })
  jobType: JobPostType;

  @Column('simple-enum', {
    enum: JobPostMode,
  })
  jobMode: JobPostMode;

  @Column({ nullable: true })
  salaryMin: number;

  @Column({ nullable: true })
  salaryMax: number;

  // For storing view counter
  @Column({ type: 'integer', default: 0, nullable: false })
  views: number;

  // Timestamps
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  // Relationships

  @ManyToOne(() => Company, (company) => company.jobPosts, {
    eager: true,
  })
  company: Company;

  /* @ManyToMany(() => Candidate, (candidate) => candidate.jobPosts)
  @JoinTable({
    name: 'job_application',
    joinColumn: {
      name: 'job_post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id',
    },
  })
  candidates: Candidate[]; */

  @OneToMany((type) => JobApplication, (jobA) => jobA.jobPost)
  jobApplications: JobApplication[];

  @ManyToMany(() => SkillSet, (skillSet) => skillSet.jobPosts, {
    cascade: true,
  })
  @JoinTable({
    name: 'job_post_tag',
    joinColumn: {
      name: 'job_post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: SkillSet[];
}
