import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';
import { SkillSet } from './skillSet.entity';

@Entity()
export class CandidateSkillSet extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @ManyToMany(() => Candidate, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  candidate: Candidate;

  @ManyToMany(() => SkillSet, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  skillSet: SkillSet;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
