import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('job_apply')
export class JobApply extends BaseEntity {
  @PrimaryColumn({ name: 'candidate_id' })
  candidateId: number;

  @PrimaryColumn({ name: 'job_post_id' })
  jobPostId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
