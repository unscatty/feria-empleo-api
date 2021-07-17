import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

// Intermediate table
@Entity()
export class JobApplication extends BaseEntity {
  @PrimaryColumn()
  candidateId: number;

  @PrimaryColumn()
  jobPostId: number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
