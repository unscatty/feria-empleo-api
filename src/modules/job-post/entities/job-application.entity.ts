import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('job_applications')
export class JobApplication extends BaseEntity {
  @PrimaryColumn({ name: 'candidate_id' })
  candidateId: number;

  @PrimaryColumn({ name: 'job_post_id' })
  jobPostId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
