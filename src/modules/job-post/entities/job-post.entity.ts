import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from 'src/modules/candidate/models/candidate.entity';
import { SkillSet } from 'src/modules/skill-set/entities/skill-set.entity';
import { Company } from 'src/modules/company/entities/company.entity';

@Entity()
export class JobPost extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: true })
  isActive!: boolean;

  @Column({ nullable: false })
  jobTitle!: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  requirements: string;

  @Column()
  salaryMin: number;

  @Column()
  salaryMax: number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  // Relationships

  @ManyToOne(() => Company, (company) => company.jobPosts)
  company: Company;

  @ManyToMany(() => Candidate, (candidate) => candidate.jobPosts)
  @JoinTable({
    name: 'job_application',
    joinColumn: {
      name: 'job_post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id',
    },
  })
  candidates: Candidate[];

  @ManyToMany(() => SkillSet, (skillSet) => skillSet.jobPosts, {
    cascade: true,
  })
  @JoinTable({
    name: 'job_post_tag',
    joinColumn: {
      name: 'job_post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: SkillSet[];
}
