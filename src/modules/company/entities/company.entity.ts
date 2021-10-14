import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { UploadedImage } from 'src/core/entities/uploaded-image.entity';
import { StateStore } from '@depthlabs/nestjs-state-machine';
import { COMPANY_GRAPH_NAME, COMPANY_STATES } from 'src/core/state-machines/company.graph';
import { ExposeToPlain, TransformToPlain } from 'src/shared/decorators/class-transform';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  invitationEmail: string;

  @Column({ type: 'varchar', nullable: false })
  activeEmail!: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  staff?: string;

  @Column({ nullable: false, default: true })
  isActive!: boolean;

  // State (StateMachine)
  // Default state is 'INVITED'
  @StateStore(COMPANY_GRAPH_NAME)
  @Column({ nullable: false, default: COMPANY_STATES.INVITED })
  state: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships
  @ExposeToPlain({ name: 'imageURL' })
  @TransformToPlain(({ value }) => value?.imageURL)
  // Uploaded image
  @OneToOne(() => UploadedImage, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  image: UploadedImage;

  @OneToOne(() => User, (user) => user.company, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.company)
  jobPosts: JobPost[];
}
