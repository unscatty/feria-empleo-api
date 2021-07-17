import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from 'src/modules/candidate/models/candidate.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

@Entity()
export class SkillSet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @ManyToMany(() => JobPost, (jobPost) => jobPost.tags)
  jobPosts: JobPost[];

  @ManyToMany(() => Candidate, (candidate) => candidate.skillSets)
  candidates: Candidate[];
}
