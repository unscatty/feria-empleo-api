import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class ExperienceDetail extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bit', nullable: false, default: false })
  isCurrentjob: boolean;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  jobTitle: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  jobDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  companyName: string;

  /*  @Column({ type: 'varchar', length: 250, nullable: false })
  jobAdress: string; */

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @JoinColumn()
  @ManyToOne(() => Candidate, {
    nullable: false,
  })
  candidate: Candidate;
}
