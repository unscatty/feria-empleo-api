import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('job_post_skill_sets')
export class JobApplication extends BaseEntity {
  @PrimaryColumn({ name: 'job_post_id' })
  jobPostId: number;

  @PrimaryColumn({ name: 'skill_set_id' })
  skillSetId: number;

  @Column()
  level: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
