import { BaseEntity, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Candidate } from '../../candidate/models/candidate.entity';
import { JobPost } from './job-post.entity';

// Intermediate table
@Entity()
export class JobApplication extends BaseEntity {
  @ManyToOne(() => Candidate, (candidate) => candidate.jobApplications, { primary: true })
  candidate: Candidate | number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobApplications, { primary: true })
  jobPost: JobPost | number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
