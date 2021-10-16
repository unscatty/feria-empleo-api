import { Candidate } from 'src/modules/candidate/models/candidate.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { SkillSet } from 'src/modules/skill-set/entities/skill-set.entity';
import { UploadedImage } from 'src/core/entities/uploaded-image.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransformToPlain } from 'src/shared/decorators/class-transform';

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

  @Column({ length: 3000 })
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

  @ManyToMany(() => Candidate, (candidate) => candidate.jobPosts)
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
  candidates: Candidate[];

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
