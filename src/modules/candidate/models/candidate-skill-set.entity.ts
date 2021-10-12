import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CandidateSkillSet extends BaseEntity {
  @PrimaryColumn()
  candidateId: number;

  @PrimaryColumn()
  skillSetId: number;

  @Column({ nullable: true })
  level: number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
