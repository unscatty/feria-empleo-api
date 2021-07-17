import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { SkillSet } from 'src/modules/skill-set/entities/skill-set.entity';
import { EducationDetail } from './education-detail.entity';
import { ExperienceDetail } from './experience-detail.entity';

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastname: string;

  @Column({ type: 'float', nullable: true })
  currentSalary: number;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => JobPost, (jobPost) => jobPost.candidates)
  jobPosts: JobPost[];

  @OneToMany(() => ExperienceDetail, (expDetail) => expDetail.candidate, {
    cascade: true,
  })
  experienceDetails: ExperienceDetail[];

  @OneToMany(() => EducationDetail, (edDetail) => edDetail.candidate, {
    cascade: true,
  })
  educationDetails: EducationDetail[];

  @ManyToMany(() => SkillSet, (skillSet) => skillSet.candidates, {
    cascade: true,
  })
  @JoinTable({
    name: 'candidate_skill_set',
    joinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_set_id',
      referencedColumnName: 'id',
    },
  })
  skillSets: SkillSet[];
}
