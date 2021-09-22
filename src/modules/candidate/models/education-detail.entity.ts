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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  institutionName: string;

  /* @Column({ type: 'varchar', length: 50, nullable: false })
  city: string; */

  @Column({ type: 'varchar', length: 50, nullable: false })
  degree: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  level: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'bit', nullable: true })
  currentlyInSchool: boolean;

  @Column({ type: 'varchar', length: 250, nullable: true })
  description: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @OneToOne(() => Candidate, {
    nullable: false,
  })
  @JoinColumn()
  candidate: Candidate;
}
