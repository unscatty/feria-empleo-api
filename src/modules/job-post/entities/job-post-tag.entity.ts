import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

// Intermediate table
@Entity()
export class JobPostTag extends BaseEntity {
  @PrimaryColumn()
  jobPostId: number;

  @PrimaryColumn()
  tagId: number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
