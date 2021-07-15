import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class EducationDetail extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @JoinColumn({ name: 'candidate_id' })
  @OneToOne(() => Candidate, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  candidate: Candidate;

  @Column({ type: 'varchar', length: 50, nullable: false })
  institutionName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  degree: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 250, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
